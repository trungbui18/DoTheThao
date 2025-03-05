package com.example.restapi.mapper;

import com.example.restapi.entity.user;
import com.example.restapi.jwt.UserRequest;
import com.example.restapi.model.dto.UserDto;



public class userMapper {
    public static UserDto toUserDto(user user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setBirthday(user.getBirthday());
        userDto.setSdt(user.getSdt());
        userDto.setAddress(user.getAddress());
        userDto.setRole(user.getRole());
        userDto.setCart(user.getCart());
        userDto.setListorders(user.getListorders());
        return userDto;
    }

    public static user toUser(UserDto userDto) {
        user user = new user();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setBirthday(userDto.getBirthday());
        user.setSdt(userDto.getSdt());
        user.setAddress(userDto.getAddress());
        user.setRole(userDto.getRole());
        user.setCart(userDto.getCart());
        user.setListorders(userDto.getListorders());
        return user;
    }
    public static user requestToUser(UserRequest userrequest) {
        user user = new user();
        user.setUsername(userrequest.getUsername());
        user.setEmail(userrequest.getEmail());
        user.setBirthday(userrequest.getBirthday());
        user.setSdt(userrequest.getSdt());
        user.setAddress(userrequest.getAddress());

        user.setPassword(userrequest.getPassword());
        user.setRole(userrequest.getRole());

        return user;
    }
    public static UserRequest userToUserRequest(user user) {
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(user.getUsername());
        userRequest.setEmail(user.getEmail());
        userRequest.setBirthday(user.getBirthday());
        userRequest.setSdt(user.getSdt());
        userRequest.setAddress(user.getAddress());
        userRequest.setPassword(user.getPassword());
        userRequest.setRole(user.getRole());
        return userRequest;
    }
}
