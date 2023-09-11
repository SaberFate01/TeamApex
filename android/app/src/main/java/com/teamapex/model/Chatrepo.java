package com.example.Chat.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Chatrepo extends CrudRepository<ChatMessage, Integer> {
}
