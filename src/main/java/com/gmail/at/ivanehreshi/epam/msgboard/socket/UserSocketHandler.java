package com.gmail.at.ivanehreshi.epam.msgboard.socket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

public class UserSocketHandler extends TextWebSocketHandler {
    private Map<String, WebSocketSession> socketMap;
    private Map<WebSocketSession, String> usernameMap;

    public UserSocketHandler() {
        socketMap = new HashMap<>();
        usernameMap = new HashMap<>();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        UriComponents uri = UriComponentsBuilder.fromUri(session.getUri()).build();
        String username = uri.getQueryParams().getFirst("username");

        if (socketMap.containsKey(username)) {
            session.sendMessage(new TextMessage(usersOnlineMessage(socketMap.size())));
            return;
        }

        session.sendMessage(new TextMessage(usersOnlineMessage(socketMap.size() + 1)));


        for (WebSocketSession socket: socketMap.values()) {
            socket.sendMessage(new TextMessage(loggedMessage(username)));
        }

        socketMap.put(username, session);
        usernameMap.put(session, username);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = usernameMap.remove(session);
        socketMap.remove(username);

        for (WebSocketSession socket: socketMap.values()) {
            socket.sendMessage(new TextMessage(signoutMessage(username)));
        }
    }

    protected String loggedMessage(String username) {
        return "{" +
                "\"logged\": \"" + username + "\"" +
               "}";
    }

    protected String signoutMessage(String username) {
        return "{" +
                "\"signout\": \"" + username + "\"" +
                "}";
    }

    protected String usersOnlineMessage(int online) {
        return "{" +
                "\"online\": " + online +
               "}";
    }

}
