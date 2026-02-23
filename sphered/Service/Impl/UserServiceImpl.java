package com.fareye.sphered.Service.Impl;

import com.fareye.sphered.Entity.User;
import com.fareye.sphered.exception.BadRequestException;
import com.fareye.sphered.exception.ResourceNotFoundException;
import com.fareye.sphered.Repository.UserRepository;
import com.fareye.sphered.Service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;   // ✅ added

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {   // ✅ added
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createUser(User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        // ✅ encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));
    }
}
