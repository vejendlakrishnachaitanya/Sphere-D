package com.fareye.sphered.Service;
import com.fareye.sphered.Entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);
}
