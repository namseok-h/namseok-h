package com.icia.boardserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "jobposting")
public class JobPostingEntity {
    @Id
    @Column(unique = true)  // mname을 고유 값으로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jnum;
    private String title;
    private String jobCategory;
    private String employmentType;
    private String numberOfPositions;
    private String workPeriod;
    private String workDays;
    private String workTime;
    private String gender;
    private String ageRange;
    private String education;
    private String applicationMethod;
    private String companyName;
    private String companyAddress;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String pay;
    private String photo;
    private String contents;
}