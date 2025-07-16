package com.icia.boardserver.repository;

import com.icia.boardserver.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface JobRepository extends CrudRepository<Job, Long>, JobRepositoryCustom {
    //검색 기능을 위한 작성 코드 없음.
}
