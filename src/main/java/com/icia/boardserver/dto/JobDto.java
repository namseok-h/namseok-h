package com.icia.boardserver.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class JobDto {
    private Long id;
    private String title;
    private String companyaddress;
    private String local;
    private String job;
    private String time;
}
