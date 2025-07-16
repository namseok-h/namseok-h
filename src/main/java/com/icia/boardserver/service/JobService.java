package com.icia.boardserver.service;

import com.icia.boardserver.dto.JobDto;
import com.icia.boardserver.dto.JobPostingDto;
import com.icia.boardserver.entity.Job;
import com.icia.boardserver.dto.JobsearchDto;
import com.icia.boardserver.entity.JobPostingEntity;
import com.icia.boardserver.repository.JobRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobService {
    @Autowired
    private JobRepository jRepo;

    private ModelMapper mapper = new ModelMapper();

    public Map<String, Object> getJobList(JobsearchDto jsDto){
        if(jsDto.getPageNum() == null){
            jsDto.setPageNum(1);
        }

        //페이지 당 보여질 job 개수
        int listCnt = 5;

        //페이징 조건 처리 객체 생성(Pageable)
        Pageable pb = PageRequest.of((jsDto.getPageNum() - 1), listCnt,
                Sort.Direction.DESC, "jobId");

        //JopRepositoryCustom의 메소드 사용
        Page<JobPostingEntity> result = jRepo.findBySearch(0L, jsDto, pb);


        List<JobPostingEntity> jobList = result.getContent();//Entity 목록
        //이후 mapper로 Job을 JopDto로 변환
        List<JobPostingDto> jList = mapper.map(jobList,
                new TypeToken<List<JobPostingDto>>(){}.getType());

        int totalPage = result.getTotalPages();

        Map<String, Object> rsMap = new HashMap<>();
        rsMap.put("jList", jList);
        rsMap.put("totalPage", totalPage);
        rsMap.put("pageNum", jsDto.getPageNum());

        return rsMap;
    }
}
