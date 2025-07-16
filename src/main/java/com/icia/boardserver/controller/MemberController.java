package com.icia.boardserver.controller;

import com.icia.boardserver.dto.MemberDto;
import com.icia.boardserver.service.MemberService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@Slf4j
public class MemberController {

    @Autowired
    private MemberService mServ;

    @PostMapping("/idCheck")
    public Map<String, String> idCheck(@RequestBody MemberDto member){
        log.info("idCheck()");
        return mServ.idCheck(member);
    }

    @PostMapping("/joinProc")
    public String joinProc(@RequestBody MemberDto memberDto){
        log.info("joinProc()");
        return mServ.insertMember(memberDto);
    }

    @PostMapping("/loginProc")
    public Map<String, String> loginProc(@RequestBody MemberDto memberDto){
        log.info("loginProc()");
        return mServ.loginProc(memberDto);
    }

    @GetMapping("/getMember")
    public MemberDto getMember(@RequestParam String mid){
        log.info("getMember()");
        return mServ.getMember(mid);
    }

    @GetMapping("/mailConfirm")
    public String mailConfirm(@RequestParam String mid)
            throws MessagingException,
            UnsupportedEncodingException {
        log.info("mailConfirm()");
        return mServ.sendEmail(mid);
    }

    @PostMapping("/changePass")
    public String changePass(@RequestBody MemberDto memberDto){
        log.info("changePass()");
        return mServ.changePass(memberDto);
    }

    // socialCheck를 수정: MemberDto 전체를 받고 닉네임, 이메일 같이 서비스로 전달
    @PostMapping("/socialCheck")
    public Map<String, Object> socialCheck(@RequestBody MemberDto memberDto) {
        log.info("socialCheck(): {}", memberDto);
        // MemberDto에 mid, mmail, nickname 등이 들어있다고 가정
        return mServ.socialCheck(memberDto);
    }

    // 소셜 회원가입 처리
    @PostMapping("/socialJoin")
    public String socialJoin(@RequestBody MemberDto memberDto) {
        log.info("socialJoin(): {}", memberDto);
        return mServ.socialJoin(memberDto);
    }

}
