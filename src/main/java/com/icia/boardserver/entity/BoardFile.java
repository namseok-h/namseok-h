package com.icia.boardserver.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "boardfile")
@Data
public class BoardFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bfnum;//파일정보 고유번호(기본키)

    @Column(nullable = false)
    private long bfbid;//게시글 번호

    @Column(nullable = false, length = 50)
    private String bforiname;//원래 파일명

    @Column(nullable = false, length = 50)
    private String bfsysname;//변경한 파일명
}
