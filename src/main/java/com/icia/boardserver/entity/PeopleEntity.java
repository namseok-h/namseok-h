package com.icia.boardserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "people")
public class PeopleEntity {
    @Id
    @Column(unique = true)  // mname을 고유 값으로 설정
    private String mname;
    private String mphone;
    private String mmail;
    private String photo;
    private String education;
    private String pr;
}