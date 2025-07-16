package com.icia.boardserver.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobsearchDto {
    private String local;
    private String job;
    private String time;
    private Integer pageNum;
}
