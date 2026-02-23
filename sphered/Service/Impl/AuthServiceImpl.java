package com.fareye.sphered.Service.Impl;

import com.fareye.sphered.Entity.Role;
import com.fareye.sphered.Entity.User;
import com.fareye.sphered.exception.BadRequestException;
import com.fareye.sphered.exception.UnauthorizedException;
import com.fareye.sphered.Repository.UserRepository;
import com.fareye.sphered.Security.JwtUtil;
import com.fareye.sphered.Service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User signup(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        // Always encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set a default role if none provided to avoid NullPointerException later
        if (user.getRole() == null) {
            user.setRole(Role.EMPLOYEE);
        }

        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("userId", user.getId());

        return response;
    }

    @Override
    public User getUserByUsername(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UnauthorizedException("User not found with username: " + username));
    }
}
