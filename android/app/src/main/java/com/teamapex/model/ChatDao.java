package com.example.Chat.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.util.Streamable;

import java.util.ArrayList;
import java.util.List;
@Service
public class ChatDao {
    @Autowired
    private Chatrepo repo;
    public List<ChatMessage> getAll(){
        List<ChatMessage> User = new ArrayList<>();
        Streamable.of(repo.findAll()).forEach(User::add);
        return User;
    }
    public void save(ChatMessage User){
        System.out.println((User));
        System.out.println(User.getType());
        System.out.println(User.getContent());
        System.out.println(User.getSender());
        repo.save(User);
    }

    private String toString(ChatMessage User) {
        String toReturn = "";
        toReturn += (User.getType());
        toReturn += (User.getContent());
        toReturn += (User.getSender());
        return toReturn;
    }
}