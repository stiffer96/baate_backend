package com.jerry.BaaTe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jerry.BaaTe.entity.User;

@RestController
public class TestController {
	
	@GetMapping("/user")
	public User getUser(){
		User user = new User("Sourav","Choudhary","sourav@gmail.com");
		
		return user;
	}
}
