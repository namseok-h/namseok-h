package com.icia.boardserver.dto;

import lombok.Data;

@Data
public class BoardFileDto {
    private long bfnum;
    private long bfbid;//게시글 번호
    private String bforiname;//원래 파일명
    private String bfsysname;//변경한 파일명
}
