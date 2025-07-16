package com.icia.boardserver.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReplyDto {
    private long rnum;
    private long rbid;
    private String rmid;
    private String rcontent;
    private Timestamp rrdate;
}
