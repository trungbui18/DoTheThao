package com.example.restapi.Controller;

import com.example.restapi.entity.user;
import com.example.restapi.exception.NotFoundException;
import com.example.restapi.jwt.UserRequest;
import com.example.restapi.model.dto.UserDto;
import com.example.restapi.security.SecurityConfig;
import com.example.restapi.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private userService userService;
    @Autowired
    private SecurityConfig security;

    @GetMapping("/user/{id}")
    public ResponseEntity<?> GetUser(@PathVariable int id) {
        UserDto user=userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/name/{name}")
    public ResponseEntity<?> GetUserByName(@PathVariable String name) {
        UserDto user=userService.getUserByname(name);
        return ResponseEntity.ok(user);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getListUser() {
        List<UserDto> listUser=userService.getAllusers();
        return ResponseEntity.ok(listUser);
    }
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(name="keyword",required = false,defaultValue ="") String name) {
        List<UserDto> listUser=userService.searchUser(name);
        return ResponseEntity.ok(listUser);
    }
    @PostMapping("/create")
    public ResponseEntity<?> CreateUser(@RequestBody UserRequest user) {
        user.setPassword(security.passwordEncoder().encode(user.getPassword()));
        UserRequest savedUser=userService.insertUser(user);
        System.out.println(user.toString());
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> UpdateUser(@RequestBody UserDto user, @PathVariable int id) {
        UserDto userUpdate=userService.updateUser(id, user);
        return new ResponseEntity<>(userUpdate, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<?> DeleteUser(@PathVariable int id) {

        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalStateException ex) {
            // Trả về lỗi 400 Bad Request với thông báo lỗi
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (NotFoundException ex) {
            // Trả về lỗi 404 Not Found với thông báo lỗi
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            // Trả về lỗi 500 Internal Server Error với thông báo chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An unexpected error occurred"));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/countuser")
    public ResponseEntity<?> CountUser() {
        long count=userService.countUser();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/userbyorderid/{id}")
    public ResponseEntity<?> getUserByOrderId(@PathVariable int id) {
        UserDto user = userService.getUserByOrderId(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
