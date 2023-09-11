package com.example.Chat.controller;

import com.example.Chat.model.ChatDao;
import com.example.Chat.model.ChatMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class APIController {
    @Autowired
    private ChatDao dao;
    @GetMapping("/user/get")
    public List<ChatMessage> getAll(){
        return dao.getAll();
    }
    @PostMapping("/user/save")
    public void save(@RequestBody ChatMessage User){
        System.out.print(User);
        dao.save(User);
    }
}
