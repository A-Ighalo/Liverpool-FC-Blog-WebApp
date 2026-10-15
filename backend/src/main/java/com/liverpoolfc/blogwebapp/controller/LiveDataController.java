package com.liverpoolfc.blogwebapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Proxies a fixed set of read-only Liverpool FC endpoints from ESPN's public soccer API.
 * Browsers cannot call ESPN directly because its CDN does not reliably send CORS headers,
 * so the frontend reads live data through here. Responses are cached to limit upstream calls,
 * and a stale copy is served if ESPN is unreachable.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/live/public")
public class LiveDataController {

    private static final Logger logger = LoggerFactory.getLogger(LiveDataController.class);

    private static final String SITE_API = "https://site.api.espn.com/apis/site/v2/sports/soccer";
    private static final String STANDINGS_API = "https://site.api.espn.com/apis/v2/sports/soccer";
    private static final String LIVERPOOL_ID = "364";
    private static final Duration CACHE_TTL = Duration.ofMinutes(5);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();

    private record CachedResponse(String body, Instant fetchedAt) {
        boolean isFresh() {
            return fetchedAt.plus(CACHE_TTL).isAfter(Instant.now());
        }
    }

    @GetMapping("/fixtures")
    public ResponseEntity<String> getFixtures() {
        return proxy(SITE_API + "/all/teams/" + LIVERPOOL_ID + "/schedule?fixture=true");
    }

    @GetMapping("/results")
    public ResponseEntity<String> getResults() {
        return proxy(SITE_API + "/all/teams/" + LIVERPOOL_ID + "/schedule");
    }

    @GetMapping("/table")
    public ResponseEntity<String> getTable() {
        return proxy(STANDINGS_API + "/eng.1/standings");
    }

    @GetMapping("/news")
    public ResponseEntity<String> getNews(@RequestParam(defaultValue = "12") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        return proxy(SITE_API + "/eng.1/news?team=" + LIVERPOOL_ID + "&limit=" + safeLimit);
    }

    @GetMapping("/squad")
    public ResponseEntity<String> getSquad() {
        return proxy(SITE_API + "/eng.1/teams/" + LIVERPOOL_ID + "/roster");
    }

    @GetMapping("/leaders")
    public ResponseEntity<String> getLeaders() {
        return proxy(SITE_API + "/eng.1/statistics");
    }

    private ResponseEntity<String> proxy(String url) {
        CachedResponse cached = cache.get(url);
        if (cached != null && cached.isFresh()) {
            return json(cached.body());
        }

        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(15))
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                cache.put(url, new CachedResponse(response.body(), Instant.now()));
                return json(response.body());
            }
            logger.warn("ESPN returned {} for {}", response.statusCode(), url);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("Interrupted while fetching {}", url);
        } catch (Exception e) {
            logger.warn("Failed to fetch {}: {}", url, e.getMessage());
        }

        if (cached != null) {
            return json(cached.body());
        }
        return ResponseEntity.status(502).contentType(MediaType.APPLICATION_JSON)
                .body("{\"message\":\"Live data is temporarily unavailable\"}");
    }

    private ResponseEntity<String> json(String body) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(body);
    }
}
