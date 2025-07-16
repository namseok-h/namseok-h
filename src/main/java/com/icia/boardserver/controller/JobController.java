package com.icia.boardserver.controller;

import com.icia.boardserver.dto.JobDto;
import com.icia.boardserver.dto.JobPostingDto;
import com.icia.boardserver.entity.Job;
import com.icia.boardserver.dto.JobsearchDto;
import com.icia.boardserver.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class JobController {
    @Autowired
    private JobService jServ;

    @GetMapping("getJobList")
    public Map<String, Object> getJobList(JobsearchDto jsDto) {
       return jServ.getJobList(jsDto);
    }
}
