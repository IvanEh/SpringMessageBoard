package com.gmail.at.ivanehreshi.epam.msgboard.entity;

import java.time.Instant;
import java.util.Objects;

public class BoardMessage {
    private Long id;
    private String text;
    private Instant timestamp;

    public BoardMessage() {
    }

    public BoardMessage(Long id, String text, Instant timestamp) {
        this.id = id;
        this.text = text;
        this.timestamp = timestamp;
    }

    public BoardMessage(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public void timestamp() {
        setTimestamp(Instant.now());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BoardMessage that = (BoardMessage) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(text, that.text) &&
                Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, text, timestamp);
    }
}
