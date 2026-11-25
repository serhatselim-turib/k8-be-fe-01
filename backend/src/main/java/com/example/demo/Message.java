package com.example.demo;

import java.time.Instant;

public record Message(long id, String text, Instant createdAt) {
}
