package com.fareye.sphered.Security;

import com.fareye.sphered.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Automatically creates constructor for final fields
public class CustomUserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build the UserDetails object using the builder pattern
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                // Ensure roles are passed correctly (e.g., ROLE_ADMIN)
                .authorities(user.getRole().name())
                .build();
    }
}