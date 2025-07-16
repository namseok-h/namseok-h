package com.icia.boardserver.controller;

import com.icia.boardserver.dto.PeopleDto;
import com.icia.boardserver.service.PeopleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class PeopleController {

    @Autowired
    private PeopleService peopleService;


    @PostMapping("/resumeProc")
    public ResponseEntity<String> handleResumeUpload(
            @RequestParam("mname") String mname,
            @RequestParam("mphone") String mphone,
            @RequestParam("mmail") String mmail,
            @RequestParam("education") String education,
            @RequestParam("pr") String pr,
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
            PeopleDto dto = new PeopleDto();
            dto.setMname(mname);
            dto.setMphone(mphone);
            dto.setMmail(mmail);
            dto.setEducation(education);
            dto.setPhoto(photoPath);
            dto.setPr(pr);

            peopleService.savePeople(dto);

            return ResponseEntity.ok("ok");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("fail");
        }
    }
}