package com.gmail.at.ivanehreshi.epam.msgboard.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {
        "com.gmail.at.ivanehreshi.epam.msgboard.controller",
        "com.gmail.at.ivanehreshi.epam.msgboard.entity"
})
@Import(WebSocketConfig.class)
public class WebConfig {
}
