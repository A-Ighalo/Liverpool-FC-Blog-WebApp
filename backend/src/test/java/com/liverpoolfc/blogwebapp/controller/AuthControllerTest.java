package com.liverpoolfc.blogwebapp.controller;

import com.liverpoolfc.blogwebapp.entity.User;
import com.liverpoolfc.blogwebapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testUserRegistration() throws Exception {
        String signupRequest = """
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123"
            }
        """;

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testDuplicateUsernameRegistration() throws Exception {
        // First registration
        String signupRequest = """
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123"
            }
        """;

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupRequest))
                .andExpect(status().isOk());

        // Duplicate registration
        String duplicateRequest = """
            {
                "username": "testuser",
                "email": "different@example.com",
                "password": "password123"
            }
        """;

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }
}