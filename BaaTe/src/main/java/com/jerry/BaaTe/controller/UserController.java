package com.jerry.BaaTe.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jerry.BaaTe.dao.UserDAO;
import com.jerry.BaaTe.entity.User;
import com.jerry.BaaTe.response.InvalidResponse;

import com.jerry.BaaTe.response.SuccessUserResponse;
import com.jerry.BaaTe.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/users")
	public Object getUsers(){
		return userService.getUsers();
	}
	
	@PostMapping("/users")
	public User saveUser(@ModelAttribute User user){
		return userService.saveUser(user);
	}
	
	@PostMapping("/login")
	public Object validateLogin(@ModelAttribute User user){
		return userService.validateLogin(user);
	}
}
