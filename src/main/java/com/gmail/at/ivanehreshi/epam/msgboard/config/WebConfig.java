package com.gmail.at.ivanehreshi.epam.msgboard.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@ComponentScan("com.gmail.at.ivanehreshi.epam.msgboard.controller")
public class WebConfig {
}
