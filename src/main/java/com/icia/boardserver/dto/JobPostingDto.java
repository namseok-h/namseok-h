package com.icia.boardserver.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class JobPostingDto {
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