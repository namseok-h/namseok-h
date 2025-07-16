package com.icia.boardserver.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NaverController {

    private final String clientId = "HJjToCdzXdUtMwcVIx4M";
    private final String clientSecret = "PZp7U9Zi56";
    private final String redirectUri = "http://localhost:3000/naver/callback"; // VSCode 프론트 콜백 주소

    @PostMapping("/naver-login")
    public ResponseEntity<?> naverLogin(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String state = body.get("state");

        // 1. 네이버 토큰 요청
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("state", state);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> tokenResponse;
        try {
            tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("토큰 요청 실패: " + e.getMessage());
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("액세스 토큰 없음");
        }

        // 2. 사용자 정보 요청
        String profileUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders profileHeaders = new HttpHeaders();
        profileHeaders.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);
        ResponseEntity<Map> profileResponse = restTemplate.exchange(profileUrl, HttpMethod.GET, profileRequest, Map.class);

        if (!profileResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("프로필 요청 실패");
        }

        Map<String, Object> resBody = (Map<String, Object>) profileResponse.getBody().get("response");
        String email = (String) resBody.get("email");
        String nickname = (String) resBody.get("nickname"); // 없으면 name으로 대체

        if (nickname == null || nickname.isEmpty()) {
            nickname = (String) resBody.get("name");
        }

        // ✅ 프론트에서 기대하는 형식으로 명확히 전달
        Map<String, String> result = new HashMap<>();
        result.put("email", email);
        result.put("nickname", nickname);

        return ResponseEntity.ok(result);
    }
}