package com.icia.boardserver.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "member")
@Data
public class Member {
    
    @Id
    @Column(length = 30)
    private String mid;

    @Column(name = "mpwd", nullable = false, length = 100)
    private String mpwd;

    @Column(nullable = false, length = 20)
    private String mname;

    @Column(nullable = false, length = 20)
    private String mphone;

    @Column(nullable = false, length = 30)
    private String mmail;

    @Column(nullable = false, length = 20)
    private String nickname;
}
