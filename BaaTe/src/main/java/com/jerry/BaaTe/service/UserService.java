package com.jerry.BaaTe.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jerry.BaaTe.dao.UserDAO;
import com.jerry.BaaTe.entity.User;
import com.jerry.BaaTe.response.InvalidResponse;
import com.jerry.BaaTe.response.SuccessUserResponse;

@Service
public class UserService {
		
	@Autowired
	private UserDAO userDao;
	
	public Object getUsers(){
		List<User> result = userDao.findAll();
		SuccessUserResponse res = new SuccessUserResponse();
		InvalidResponse ires = new InvalidResponse();
		Object obj ;
		if(result.size() > 0){
			res.setCode(1);
			res.setCount(result.size());
			res.setResult(result);
			obj = res;
		}
		else{
			ires.setCode(0);
			ires.setMessage("No data found");
			obj = ires;
		}
		return  obj; 
	}
	
	public User saveUser( User user){
		User temp = userDao.save(user);
		return temp;
	}
	
	public Object validateLogin( User user){
		String email = user.getEmail();
		String password = user.getPassword();
		List<User> users = userDao.findAll();
		Iterator<User> it = users.iterator();
		User validatedUser= new User();
		while(it.hasNext()){
			User temp =  it.next();
			
			if(email.equals(temp.getEmail()) && password.equals(temp.getPassword())){
				validatedUser = temp;
				break;
			}
			
		}
		
		SuccessUserResponse res = new SuccessUserResponse();
		InvalidResponse ires = new InvalidResponse();
		Object obj ;
		if(validatedUser.getId() != 0){
			res.setCode(1);
			res.setCount(1);
			List<User> list = new ArrayList<User>();
			list.add(validatedUser);
			res.setResult(list);
			obj = res;
		}
		else{
			ires.setCode(0);
			ires.setMessage("Invalid username and password");
			obj = ires;
		}
			
			
		return obj;
	}
}
