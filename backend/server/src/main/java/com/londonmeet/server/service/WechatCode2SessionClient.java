package com.londonmeet.server.service;

import com.londonmeet.common.exception.BusinessException;
import com.londonmeet.server.config.WechatProperties;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

/**
 * Client for WeChat code2Session login exchange.
 */
@Component
@RequiredArgsConstructor
public class WechatCode2SessionClient {

    private static final String CODE2_SESSION_URL = "https://api.weixin.qq.com/sns/jscode2session";

    private final WechatProperties wechatProperties;

    public WechatSession exchange(String code) {
        if (!StringUtils.hasText(code)) {
            throw new BusinessException("code or openid is required.");
        }

        if (wechatProperties.isMockEnabled()) {
            String normalizedCode = code.startsWith("mock:") ? code.substring("mock:".length()) : code;
            String mockOpenid = "mock-openid-" + normalizedCode.replaceAll("[^A-Za-z0-9_-]", "");
            return new WechatSession(mockOpenid, null, null);
        }

        if (!StringUtils.hasText(wechatProperties.getAppId()) || !StringUtils.hasText(wechatProperties.getSecret())) {
            throw new BusinessException("WeChat app-id and secret must be configured.");
        }

        String uri = UriComponentsBuilder.fromUriString(CODE2_SESSION_URL)
                .queryParam("appid", wechatProperties.getAppId())
                .queryParam("secret", wechatProperties.getSecret())
                .queryParam("js_code", code)
                .queryParam("grant_type", "authorization_code")
                .toUriString();

        Map<?, ?> response = RestClient.create()
                .get()
                .uri(uri)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new BusinessException("Empty response from WeChat.");
        }

        Object errcode = response.get("errcode");
        if (errcode != null && !"0".equals(String.valueOf(errcode))) {
            Object errmsg = response.get("errmsg");
            throw new BusinessException("WeChat login failed: " + (errmsg == null ? "unknown error" : errmsg));
        }

        Object openid = response.get("openid");
        if (openid == null || !StringUtils.hasText(String.valueOf(openid))) {
            throw new BusinessException("WeChat response did not include openid.");
        }

        return new WechatSession(
                String.valueOf(openid),
                response.get("unionid") == null ? null : String.valueOf(response.get("unionid")),
                response.get("session_key") == null ? null : String.valueOf(response.get("session_key"))
        );
    }

    @Data
    public static class WechatSession {
        private final String openid;
        private final String unionid;
        private final String sessionKey;
    }
}
