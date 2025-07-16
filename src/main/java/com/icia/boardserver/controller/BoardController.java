package com.icia.boardserver.controller;

import com.icia.boardserver.dto.BoardDto;
import com.icia.boardserver.dto.BoardFileDto;
import com.icia.boardserver.dto.PageInfoDto;
import com.icia.boardserver.dto.ReplyDto;
import com.icia.boardserver.service.BoardService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class BoardController {
    @Autowired
    private BoardService bServ;

    @GetMapping("/list")
    public Map<String, Object> getList(PageInfoDto pageInfo){
        log.info("getList() - pageInfo : {}", pageInfo);
        return bServ.getBoardList(pageInfo);
    }

    @PostMapping("/writeProc")
    public String writeProc(@RequestPart(value = "post", required = true)BoardDto post,
                            @RequestPart(value = "files", required = false)List<MultipartFile> files,
                            HttpSession session){
        log.info("writeProc()");
        return bServ.insertBoard(post, files, session);
    }

    @GetMapping("getBoard")
    public BoardDto getBoard(@RequestParam long bnum){
        log.info("getBoard()");
        return bServ.getBoard(bnum);
    }

    @PostMapping("/deleteBoard")
    public String deleteBoard(@RequestParam long bnum,
                              HttpSession session){
        log.info("deleteBoard()");
        return bServ.deleteBoard(bnum, session);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> fileDownload(BoardFileDto bfile,
                                                 HttpSession session)
            throws IOException {
        log.info("fileDownload()");
        return bServ.fileDownload(bfile, session);
    }

    @PostMapping("/fileDelete")
    public List<BoardFileDto> fileDelete(@RequestBody BoardFileDto bFile,
                                         HttpSession session){
        log.info("fileDelete()");
        return bServ.fileDelete(bFile, session);
    }

    @PostMapping("/replyWrite")
    public List<ReplyDto> replyWrite(@RequestBody ReplyDto replyDto){
        log.info("replyWrite()");
        return bServ.replyWrite(replyDto);
    }
}//class end
