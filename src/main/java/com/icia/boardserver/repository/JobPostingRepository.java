package com.icia.boardserver.repository;

import com.icia.boardserver.entity.Board;
import com.icia.boardserver.entity.BoardFile;
import com.icia.boardserver.entity.JobPostingEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPostingEntity, Long> {
    Page<JobPostingEntity> findByCompanyAddressContains(String local, Pageable pb);
}