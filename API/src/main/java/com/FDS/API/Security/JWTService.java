package com.FDS.API.Security;

import java.util.ArrayList;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 * this service handles the creation and validation of JWT tokens
 */
public class JWTService {
    static final long EXPIRATIONTIME = 864_000_00; // 1 day in milliseconds
    static final String SIGNINGKEY = "4F5A6B7C8D9E0F1A2B3C4D5E6F708192A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5"; // randomly generated 256 bits signing key
    static final String PREFIX = "Bearer ";

    // Add token to Authorization header
    static public void addToken(HttpServletResponse res, String username) {

        SecretKey key = Keys.hmacShaKeyFor(SIGNINGKEY.getBytes()); // converts SIGNINGKEY into a SecretKey using the HMAC-SHA algorithm
        String JwtToken = Jwts.builder()
                .subject(username)
                .expiration(new Date(System.currentTimeMillis()
                        + EXPIRATIONTIME))
                .signWith(key)
                .compact();
        System.out.println(JwtToken);
        res.addHeader("Authorization", PREFIX + JwtToken); // adds the token to the Authorization header in the HTTP response
        res.addHeader("Access-Control-Expose-Headers", "Authorization"); // should be accessible from the client
    }

    // Get token from Authorization header
    static public Authentication getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        SecretKey key = Keys.hmacShaKeyFor(SIGNINGKEY.getBytes());

        if (token != null) {
            try {
                String user = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token.replace("Bearer ", ""))
                        .getPayload()
                        .getSubject();
                if (user != null)
                    return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        return null;
    }
}