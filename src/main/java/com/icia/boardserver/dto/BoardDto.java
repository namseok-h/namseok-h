package com.icia.boardserver.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class BoardDto {
    private long bnum;//글번호
    private String btitle;//글제목
    private String bmid;//작성자 아이디
    private String bcontent;//글내용
    private Timestamp rdate;//작성일
    //첨부파일 목록
    private List<BoardFileDto> bfList;
    //댓글 목록
    private List<ReplyDto> replyList;
}
