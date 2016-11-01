package com.gmail.at.ivanehreshi.epam.msgboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class SampleController {

    @GetMapping
    public String home() {
        return "Hello, Home";
    }

}
