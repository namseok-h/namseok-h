package com.icia.boardserver.service;

import com.icia.boardserver.dto.*;
import com.icia.boardserver.entity.Board;
import com.icia.boardserver.entity.BoardFile;
import com.icia.boardserver.entity.JobPostingEntity;
import com.icia.boardserver.entity.Reply;
import com.icia.boardserver.repository.JobPostingRepository;
import com.icia.boardserver.repository.ReplyRepository;
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
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    private ModelMapper mapper = new ModelMapper();

    public void saveJobPosting(JobPostingDto dto) {
        JobPostingEntity entity = new JobPostingEntity();
        entity.setTitle(dto.getTitle());
        entity.setJobCategory(dto.getJobCategory());
        entity.setEmploymentType(dto.getEmploymentType());
        entity.setNumberOfPositions(dto.getNumberOfPositions());
        entity.setWorkPeriod(dto.getWorkPeriod());
        entity.setWorkDays(dto.getWorkDays());
        entity.setWorkTime(dto.getWorkTime());
        entity.setGender(dto.getGender());
        entity.setAgeRange(dto.getAgeRange());
        entity.setEducation(dto.getEducation());
        entity.setApplicationMethod(dto.getApplicationMethod());
        entity.setCompanyName(dto.getCompanyName());
        entity.setCompanyAddress(dto.getCompanyAddress());
        entity.setContactName(dto.getContactName());
        entity.setContactEmail(dto.getContactEmail());
        entity.setContactPhone(dto.getContactPhone());
        entity.setPhoto(dto.getPhoto());
        entity.setPay(dto.getPay());
        entity.setContents(dto.getContents());
        jobPostingRepository.save(entity);
    }

    public Map<String, Object> getBoardList(PageInfoDto pageInfo){

        if(pageInfo.getPageNum() == null){
            pageInfo.setPageNum(1);
        }
        //페이지 당 보여질 게시글 개수
        int listCnt = 5;

        //페이징 조건 처리 객체(Pageable)
        Pageable pb = PageRequest.of((pageInfo.getPageNum() - 1),
                listCnt, Sort.Direction.DESC, "jnum");
        //PageRequest.of(페이지번호, 페이지당 게시글 개수, 정렬방식, 컬럼명)

        //페이징 처리된 게시글 목록 가져오기
        Page<JobPostingEntity> result = jobPostingRepository.findByCompanyAddressContains(pageInfo.getLocal(), pb);

        List<JobPostingEntity> jeList = result.getContent();
        List<JobPostingDto> jList = mapper.map(jeList,
                new TypeToken<List<JobPostingDto>>(){}.getType());

        //전체 페이지 개수
        int totalPage = result.getTotalPages();

        Map<String, Object> rsMap = new HashMap<>();
        rsMap.put("jList", jList);//게시글 목록
        rsMap.put("totalPage", totalPage);
        rsMap.put("pageNum", pageInfo.getPageNum());




        return rsMap;
    }
    public JobPostingDto getJob(long jnum){


        //DB에서 게시글 가져오기
        JobPostingEntity jobPostingEntity = jobPostingRepository.findById(jnum).get();

        //게시글과 파일 목록을 boardDto에 담기
        JobPostingDto jobPostingDto = mapper.map(jobPostingEntity, JobPostingDto.class);


        return jobPostingDto;
    }
    

}
