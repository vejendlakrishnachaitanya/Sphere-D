package com.fareye.sphered.Controller;

import com.fareye.sphered.Entity.User;
import com.fareye.sphered.Service.UserService;
import com.fareye.sphered.Repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService,
                          UserRepository userRepository) {

        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Get User By ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {

        return userService.getUserById(id);

    }

    // Create User
    @PostMapping
    public User createUser(@RequestBody User user) {

        return userService.createUser(user);

    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();

    }

    // NEW: User Stats API
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {

        long totalUsers = userRepository.count();

        return ResponseEntity.ok(new Object() {

            public final long totalUsersCount = totalUsers;

        });
    }
}