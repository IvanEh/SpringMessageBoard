package com.gmail.at.ivanehreshi.epam.msgboard.repository;

import com.gmail.at.ivanehreshi.epam.msgboard.entity.BoardMessage;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class BoardRepository{
    private Map<Long, BoardMessage> messages;
    private long nextId = 0;

    public BoardRepository() {
        messages = new LinkedHashMap<>();
    }

    public void addMessage(BoardMessage message) {
        message.setId(getNextId());
        message.timestamp();

        messages.put(message.getId(), message);
    }

    public BoardMessage getMessage(Long id) {
        return messages.get(id);
    }

    public void removeMessage(BoardMessage message) {
        messages.remove(message.getId());
    }

    private long getNextId() {
        return nextId++;
    }

    public Collection<BoardMessage> getAllMessages() {
        return messages.values();
    }

}


