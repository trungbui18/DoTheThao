package com.example.restapi.service;

import com.example.restapi.entity.Order;
import com.example.restapi.entity.user;
import com.example.restapi.exception.NotFoundException;
import com.example.restapi.jwt.UserRequest;
import com.example.restapi.mapper.userMapper;
import com.example.restapi.model.dto.UserDto;
import com.example.restapi.repository.OrderRepository;
import com.example.restapi.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Service
public class userServiceIpl implements userService{
    @Autowired
    UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<UserDto> getAllusers() {
        List<user> listUSer = userRepository.findAll();
        return listUSer.stream().map((User) ->userMapper.toUserDto(User)).collect(Collectors.toList());
    }


    @Override
    public UserDto getUserById(int id) {
         user us = userRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("User with ID " + id + " not found"));
        return userMapper.toUserDto(us);
    }

    @Override
    public UserDto getUserByname(String name) {
        user us = userRepository.findByUsername(name)
                .orElseThrow(() -> new NotFoundException("User with ID " + name + " not found"));
        return userMapper.toUserDto(us);    }

    @Override
    public List<UserDto> searchUser(String name) {
        List<user> listUser=userRepository.findAll();
        return listUser.stream().filter(User->User.getUsername().toLowerCase().contains(name.toLowerCase()))
                .map((User) ->userMapper.toUserDto(User)).collect(Collectors.toList());
    }

    @Override
    public UserRequest insertUser(UserRequest userrequest) {
        user us = userMapper.requestToUser(userrequest);
        user savedUser = userRepository.save(us);
        return userMapper.userToUserRequest(savedUser);
    }

    @Override
    public UserDto updateUser(int id, UserDto userDto) {
        user userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with ID " + id + " not found"));

        // Cập nhật thông tin người dùng từ UserDto
        userToUpdate.setUsername(userDto.getUsername());
        userToUpdate.setEmail(userDto.getEmail());
        userToUpdate.setAddress(userDto.getAddress());
        userToUpdate.setSdt(userDto.getSdt());
        userToUpdate.setBirthday(userDto.getBirthday());
        userRepository.save(userToUpdate);

        return userMapper.toUserDto(userToUpdate);
    }

    @Override
    public void deleteUser(int id) {
        user userDel = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with ID " + id + " not found"));

        Long orderCount = userRepository.countByuserIdInOrder(id);
        if (orderCount > 0) {
            throw new IllegalStateException("User is part of an order and cannot be deleted.");
        }

        // Nếu không có order, tiến hành xóa
        userRepository.delete(userDel);
    }

    @Override
    public long countUser() {
        return userRepository.count();
    }

    @Override
    public UserDto getUserByOrderId(int orderId) {
        // Lấy ID của user dựa trên orderId
        Integer userId = userRepository.findUserIdByOrderId(orderId);
        if (userId == null) {
        }

        // Lấy thông tin user từ userId
        user u = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
        return new UserDto(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getBirthday(),
                u.getSdt(),
                u.getAddress(),
                u.getRole(),
                u.getListorders(),
                u.getCart()
        );
    }



}
