package com.icia.boardserver.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OAuthRequestDto {
    private String code;
    private String state;
}
