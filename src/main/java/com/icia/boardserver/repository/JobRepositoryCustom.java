package com.icia.boardserver.repository;

import com.icia.boardserver.dto.JobsearchDto;
import com.icia.boardserver.entity.Board;
import com.icia.boardserver.entity.Job;
import com.icia.boardserver.entity.JobPostingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface JobRepositoryCustom {
    Page<JobPostingEntity> findBySearch(Long jobId, JobsearchDto jsDto, Pageable pageable);
}
