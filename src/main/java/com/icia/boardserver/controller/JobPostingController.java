package com.icia.boardserver.controller;

import com.icia.boardserver.dto.BoardDto;
import com.icia.boardserver.dto.JobPostingDto;
import com.icia.boardserver.dto.PageInfoDto;
import com.icia.boardserver.service.JobPostingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@Slf4j
public class JobPostingController {

    @Autowired
    private JobPostingService jopPostingService;

    @GetMapping("/companyaddress")
    public Map<String, Object> getList(PageInfoDto pageInfo){
        log.info("getList()");
        return jopPostingService.getBoardList(pageInfo);
    }
    @GetMapping("getJob")
    public JobPostingDto getJob(@RequestParam long jnum){
        log.info("getJob()");
        return jopPostingService.getJob(jnum);
    }


    @PostMapping("/jobposting")
    public ResponseEntity<String> handleResumeUpload(
            @RequestParam("title") String title,
            @RequestParam("jobCategory") String jobCategory,
            @RequestParam("employmentType") String employmentType,
            @RequestParam("numberOfPositions") String numberOfPositions,
            @RequestParam("workPeriod") String workPeriod,
            @RequestParam("workDays") String workDays,
            @RequestParam("workTime") String workTime,
            @RequestParam("gender") String gender,
            @RequestParam("ageRange") String ageRange,
            @RequestParam("education") String education,
            @RequestParam("applicationMethod") String applicationMethod,
            @RequestParam("companyName") String companyName,
            @RequestParam("companyAddress") String companyAddress,
            @RequestParam("contactName") String contactName,
            @RequestParam("contactEmail") String contactEmail,
            @RequestParam("contactPhone") String contactPhone,
            @RequestParam("pay") String pay,
            @RequestParam("contents") String contents,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        try {
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String photoPath = null;

            if (photo != null && !photo.isEmpty()) {
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                Path path = Paths.get(uploadDir + filename);
                photo.transferTo(path);
                photoPath = path.toString();
            }

            // DTO 생성 후 서비스에 전달
            JobPostingDto dto = new JobPostingDto();
            dto.setTitle(title);
            dto.setJobCategory(jobCategory);
            dto.setEmploymentType(employmentType);
            dto.setNumberOfPositions(numberOfPositions);
            dto.setWorkPeriod(workPeriod);
            dto.setWorkDays(workDays);
            dto.setWorkTime(workTime);
            dto.setGender(gender);
            dto.setAgeRange(ageRange);
            dto.setEducation(education);
            dto.setApplicationMethod(applicationMethod);
            dto.setCompanyName(companyName);
            dto.setCompanyAddress(companyAddress);
            dto.setContactName(contactName);
            dto.setContactEmail(contactEmail);
            dto.setContactPhone(contactPhone);
            dto.setPhoto(photoPath);
            dto.setPay(pay);
            dto.setContents(contents);

            jopPostingService.saveJobPosting(dto);
            return ResponseEntity.ok("ok");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("fail");
        }
    }
}