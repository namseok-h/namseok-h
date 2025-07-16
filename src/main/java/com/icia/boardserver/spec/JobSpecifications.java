package com.icia.boardserver.spec;

import com.icia.boardserver.entity.Job;
import com.icia.boardserver.dto.JobsearchDto;
import org.springframework.data.jpa.domain.Specification;

public class JobSpecifications {

    // 필터 조건을 동적으로 추가하는 메소드
    public static Specification<Job> withConditions(JobsearchDto dto) {
        return (root, query, criteriaBuilder) -> {
            // 기본 조건으로 '1=1'을 설정 (조건이 없으면 아무것도 추가하지 않음)
            Specification<Job> spec = Specification.where(null);

            // local 필터 추가
            if (dto.getLocal() != null && !dto.getLocal().isEmpty()) {
                spec = spec.and(localEqual(dto.getLocal()));
            }

            // job 필터 추가
            if (dto.getJob() != null && !dto.getJob().isEmpty()) {
                spec = spec.and(jobEqual(dto.getJob()));
            }

            // day 필터 추가
            if (dto.getTime() != null && !dto.getTime().isEmpty()) {
                spec = spec.and(dayEqual(dto.getTime()));
            }

            // 동적으로 추가된 조건을 반환
            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }

    // local 필터 조건
    private static Specification<Job> localEqual(String local) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("local"), local);
    }

    // job 필터 조건
    private static Specification<Job> jobEqual(String job) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("job"), job);
    }

    // day 필터 조건
    private static Specification<Job> dayEqual(String day) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("day"), day);
    }
}
