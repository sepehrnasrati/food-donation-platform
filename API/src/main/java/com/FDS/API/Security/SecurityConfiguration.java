package com.FDS.API.Security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.FDS.API.TestUser.TestUserRepository;

@Configuration
public class SecurityConfiguration {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private TestUserRepository testUserRepo;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable()); // disable csrf
		
		http
		.cors((cors) -> cors
			.configurationSource(corsConfigurationSource()) // set corsConfiguration from this method corsConfigurationSource()
		);
		
		http.sessionManagement((session) -> session // this is to prevent spring security from creating sessions (no session cookies are sent or stored) as they will be handled based on the token (JWT) passed in the request header.
		    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		);
		
        // enables username (email) and password-based login
		http
            .addFilterBefore(new LoginFilter("/login", authenticationManager(http.getSharedObject(AuthenticationConfiguration.class)), testUserRepo), UsernamePasswordAuthenticationFilter.class)
            // this filter looks for a JWT in the header and authorises the request if a valid JWT is present
            .addFilterBefore(new JWTAuthenticationFilter(), 
				UsernamePasswordAuthenticationFilter.class);
		
		http // setting the unauthorised endpoints
			.authorizeHttpRequests((authorize) -> authorize
				.requestMatchers(HttpMethod.POST,"/register").permitAll() // allow unauthenticated users to make POST requests to any URL that starts with /user/
				.requestMatchers("/h2-console/**").permitAll() // configuration to enable access to the /h2-console endpoint or Spring will lock it up
                .requestMatchers(HttpMethod.GET, "/hello").permitAll() // allow unauthenticated requests to /hello (since this initially checks if the backend is running)
                .requestMatchers(HttpMethod.GET, "/forum/posts/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/users/**").permitAll()
				.requestMatchers("/fds-websocket/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/donations").permitAll()
				.requestMatchers(HttpMethod.GET, "/donations/**").permitAll()
				.requestMatchers(HttpMethod.POST, "/donations").permitAll()
				.requestMatchers(HttpMethod.PUT, "/donations/**").permitAll()
				//changes
				.requestMatchers(HttpMethod.GET, "/expiry/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/expiry/**").permitAll()
				.requestMatchers(HttpMethod.PUT, "/expiry/**").permitAll()
				.requestMatchers(HttpMethod.DELETE, "/expiry/**").permitAll()
				.requestMatchers(HttpMethod.OPTIONS, "/expiry/**").permitAll()
                // Leaderboard endpoints
                .requestMatchers(HttpMethod.GET, "/api/leaderboard/**").permitAll()
                // Leaderboard comments endpoints
                .requestMatchers(HttpMethod.GET, "/api/leaderboard/comments").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/leaderboard/comments/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/leaderboard/comments").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/leaderboard/comments/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/leaderboard/comments/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/leaderboard/comments/*/like").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/leaderboard/comments/*/like").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/leaderboard/business-only/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/leaderboard/rank/**").permitAll()
                .anyRequest().authenticated() // requires authentication for all other endpoints
			);

		http // allow iframe rendering only from the same origin
			.headers(headers -> headers
				.frameOptions(frameOptions -> frameOptions
					.sameOrigin()));

		return http.build();
	}
    
    // configures CORS to allow requests from http://localhost:5173 with GET and POST methods.
    @Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Arrays.asList("*"));
	    configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(Arrays.asList("*"));
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // container to manage url patterns and their associated CORS configurations
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
}