package com.gmail.at.ivanehreshi.epam.msgboard.controller;

import com.gmail.at.ivanehreshi.epam.msgboard.entity.BoardMessage;
import com.gmail.at.ivanehreshi.epam.msgboard.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.net.URI;
import java.util.Collection;

@RestController
@RequestMapping(path = "/messages", consumes = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class BoardController {
    @Autowired
    private BoardRepository boardRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<BoardMessage>> allMessages() {
        return ResponseEntity.ok(boardRepository.getAllMessages());
    }

    @GetMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public BoardMessage getMessage(@PathVariable Long id) {
        return boardRepository.getMessage(id);
    }

    @PostMapping
    public ResponseEntity<BoardMessage> postMessage(@RequestBody BoardMessage message) {
        boardRepository.addMessage(message);

        BoardController mockMsg = MvcUriComponentsBuilder.on(this.getClass());

        mockMsg.getMessage(message.getId());
        URI uri = MvcUriComponentsBuilder.fromMethodCall(mockMsg)
                    .build().encode().toUri();

        return ResponseEntity.created(uri).body(message);
    }


    public BoardRepository getBoardRepository() {
        return boardRepository;
    }

    public void setBoardRepository(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }
}
