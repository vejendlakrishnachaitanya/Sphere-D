package com.fareye.sphered.Service;

import com.fareye.sphered.Entity.User;
import java.util.Map;

public interface AuthService {
    User signup(User user);

    Map<String, Object> login(String username, String password);

    User getUserByUsername(String username);
}