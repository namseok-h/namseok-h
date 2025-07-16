package com.icia.boardserver.dto;

import lombok.Data;

@Data
public class PageInfoDto {
    private String column;
    private String keyword;
    private String local;
    private Integer pageNum;
}
