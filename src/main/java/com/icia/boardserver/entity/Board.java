package com.icia.boardserver.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "board")
@Data
public class Board {
    //primary key에 자동증가(auto-increment) 설정
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bnum;//글번호

    @Column(nullable = false, length = 40)
    private String btitle;//글제목

    @Column(nullable = false, length = 30)
    private String bmid;//작성자 아이디

    @Column(nullable = false)
    private String bcontent;//글내용

    @CreationTimestamp
    @Column
    private Timestamp rdate;//작성일
}
