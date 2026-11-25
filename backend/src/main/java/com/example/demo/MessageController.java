package com.example.demo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.net.InetAddress;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final List<Message> messages = new CopyOnWriteArrayList<>();
    private final AtomicLong seq = new AtomicLong();

    @Value("${app.env:local}")
    private String env;

    public record CreateMessageRequest(@NotBlank String text) {}

    // Frontend'in backend'e ulaştığını göstermek için: hangi pod cevap verdi?
    @GetMapping("/hello")
    public Map<String, Object> hello() throws Exception {
        return Map.of(
                "message", "Merhaba, backend'den selamlar!",
                "host", InetAddress.getLocalHost().getHostName(),
                "env", env,
                "time", Instant.now().toString()
        );
    }

    @GetMapping("/messages")
    public List<Message> list() {
        return messages;
    }

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public Message create(@Valid @RequestBody CreateMessageRequest req) {
        Message m = new Message(seq.incrementAndGet(), req.text(), Instant.now());
        messages.add(m);
        return m;
    }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        messages.removeIf(m -> m.id() == id);
    }
}
