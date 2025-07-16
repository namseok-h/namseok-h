package com.icia.boardserver.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "reply")
@Data
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long rnum;

    @Column(nullable = false)
    private long rbid;

    @Column(nullable = false)
    private String rmid;

    @Column(nullable = false, length = 100)
    private String rcontent;

    @CreationTimestamp
    @Column
    private Timestamp rrdate;
}
