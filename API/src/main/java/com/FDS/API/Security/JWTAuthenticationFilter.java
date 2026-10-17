package com.FDS.API.Security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

/*
 * this class uses the JWT service to get the JWT from the HTTP request Authorisation header and
 * builds a UsernamePasswordAuthenticationToken, which the Authentication Manager uses to authenticate the user
 */
public class JWTAuthenticationFilter extends GenericFilterBean {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        /*
         * this is core method that gets invoked whenever an HTTP request is intercepted by this filter
         */

        Authentication authentication = JWTService.getAuthentication((HttpServletRequest) request); // if token is valid, it will return an Authentication object

        // Spring uses SecurityContext to store  authentication details (such as the user’s roles, permissions, and username)
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}