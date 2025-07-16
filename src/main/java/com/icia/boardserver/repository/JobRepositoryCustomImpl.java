package com.icia.boardserver.repository;

import com.icia.boardserver.dto.JobsearchDto;
import com.icia.boardserver.entity.Board;
import com.icia.boardserver.entity.Job;
import com.icia.boardserver.entity.JobPostingEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JobRepositoryCustomImpl implements JobRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<JobPostingEntity> findBySearch(Long jnum, JobsearchDto jsDto, Pageable pageable){
        //job 목록 구하는 쿼리
        String sql = "select * from jobposting where 1=1 "; //1=1은 where를 넣기 위해 작성한 것.
        //뒤에 and가 붙지 않으면 아무 효과가 없는 문장임.

        //전체 개수 구하는 쿼리
        String countSql = "select count(*) from jobposting where 1=1 ";

        //local, job, day가 있으면 and를 추가(개수 구하는 쿼리도 동일)
        if(!jsDto.getLocal().isEmpty()){
            sql += " and company_address like concat('%',:companyaddress,'%')";
            countSql += " and company_address like concat('%',:companyaddress,'%')";
        }
        if(!jsDto.getJob().isEmpty()){
            sql += " and job_category = :job";
            countSql += " and job_category = :job";
        }
        if(!jsDto.getTime().isEmpty()){
            sql += " and work_time = :time";
            countSql += " and work_time = :time";
        }
        sql += " order by jnum DESC"; //마지막에 정렬 방식(내림차순인데 정렬 안할 거면 지울것)

        Query query = entityManager.createNativeQuery(sql, JobPostingEntity.class);
        Query countQuery = entityManager.createNativeQuery(countSql);

        if(!jsDto.getLocal().isEmpty()){
            query.setParameter("companyaddress", jsDto.getLocal());
            countQuery.setParameter("companyaddress", jsDto.getLocal());
        }
        if(!jsDto.getJob().isEmpty()){
            query.setParameter("job", jsDto.getJob());
            countQuery.setParameter("job", jsDto.getJob());
        }
        if(!jsDto.getTime().isEmpty()){
            query.setParameter("time", jsDto.getTime());
            countQuery.setParameter("time", jsDto.getTime());
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<JobPostingEntity> jobList = query.getResultList();
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        return new PageImpl<>(jobList, pageable, total);
    }
}
