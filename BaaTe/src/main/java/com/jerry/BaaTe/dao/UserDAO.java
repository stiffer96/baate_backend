package com.jerry.BaaTe.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jerry.BaaTe.entity.User;

public interface UserDAO extends JpaRepository<User,Integer> {

}
