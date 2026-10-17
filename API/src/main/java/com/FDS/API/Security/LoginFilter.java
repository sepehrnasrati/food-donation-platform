package com.FDS.API.Security;

import java.io.IOException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserDTO;
import com.FDS.API.TestUser.TestUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends AbstractAuthenticationProcessingFilter {
    private final TestUserRepository userRepo;

    public LoginFilter(String url, AuthenticationManager authManager, TestUserRepository userRepo) {
        /*
         * url is the endpoint URL this filter applies to (/login)
         * the AuthenticationManager responsible for performing the actual authentication.
         */
        super(new AntPathRequestMatcher(url));
        this.setAuthenticationManager(authManager);
        this.userRepo = userRepo;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException, IOException, ServletException {
        // read the request body into an AccountCredentials object using ObjectMapper (jackson). The request body is expected to contain JSON with email and password
        AccountCredentials userCredentials = new ObjectMapper()
            .readValue(req.getInputStream(), AccountCredentials.class); // AccountCredentials is similar to a dto

        /* code below creates an UsernamePasswordAuthenticationToken with the email and password
         * AuthenticationManager uses the created token to perform the actual authentication
         */
        return this.getAuthenticationManager().authenticate( // 
            new UsernamePasswordAuthenticationToken( // token that is used by the authManager
                userCredentials.getEmail(),
                userCredentials.getPassword()));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) throws IOException, ServletException {
        /*
         * this method is called if the user is successfully authenticated!
         */

        JWTService.addToken(res, auth.getName()); // generate a JWT for the authenticated user which can be used by the client for requests

        // create user's dto to return in response body
        String email = auth.getName();
        TestUser currentUser = userRepo.findByEmail(email);
        TestUserDTO userDTO = new TestUserDTO(currentUser.getUserID(), currentUser.getAccountType(), currentUser.getName(), currentUser.getEmail(), currentUser.getProfilePic(), currentUser.getAbout(), currentUser.getCreatedAt());
        
        res.setContentType("application/json");
        ObjectMapper objectMapper = new ObjectMapper();
        res.getWriter().write(objectMapper.writeValueAsString(userDTO)); // return the userDTO as json in response body
    }
}