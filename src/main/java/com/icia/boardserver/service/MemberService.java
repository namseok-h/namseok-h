package com.icia.boardserver.service;

import com.icia.boardserver.dto.MemberDto;
import com.icia.boardserver.entity.Member;
import com.icia.boardserver.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class MemberService {
    @Autowired
    private MemberRepository mRepo;

    //비밀번호 암호화처리용 객체
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    //DTO <-> Entity 매핑 객체
    private ModelMapper mapper = new ModelMapper();

    @Autowired
    private JavaMailSender emailSender;

    private String authNum; // 인증 코드 저장 변수

    public Map<String, String> idCheck(MemberDto member){
        log.info("idCheck() : mid - {}", member.getMid());
        Map<String, String> rsMap = new HashMap<>();

        long mcnt = mRepo.countByMid(member.getMid());
        log.info("mcnt : {}", mcnt);

        if(mcnt == 0){
            rsMap.put("result", "ok");
            rsMap.put("msg", "사용 가능한 아이디입니다.");
        } else {
            rsMap.put("result", "fail");
            rsMap.put("msg", "사용할 수 없는 아이디입니다.");
        }

        return rsMap;
    }

    public String insertMember(MemberDto memberDto){
        log.info("insertMember()");
        String result = null;

        String epwd = encoder.encode(memberDto.getMpwd());
        memberDto.setMpwd(epwd);

        Member member = mapper.map(memberDto, Member.class);

        try {
            mRepo.save(member);
            result = "ok";
        } catch (Exception e) {
            e.printStackTrace();
            result = "fail";
        }

        return result;
    }

    public Map<String, String> loginProc(MemberDto memberDto){
        log.info("loginProc()");
        Map<String, String> rsMap = new HashMap<>();

        try {
            Member mem = mRepo.findById(memberDto.getMid()).get();
            if(encoder.matches(memberDto.getMpwd(), mem.getMpwd())){
                rsMap.put("result", "ok");
                rsMap.put("id", mem.getMid());
                rsMap.put("mname", mem.getMname());
            } else {
                rsMap.put("result", "fail");
                rsMap.put("msg", "비밀번호가 틀립니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            rsMap.put("result", "fail");
            rsMap.put("msg", "아이디가 존재하지 않습니다.");
        }
        return rsMap;
    }

    public MemberDto getMember(String mid){
        log.info("getMember()");
        Member mem = mRepo.findById(mid).get();
        MemberDto member = mapper.map(mem, MemberDto.class);
        member.setMpwd("");
        return member;
    }

    public String sendEmail(String mid)
            throws MessagingException,
            UnsupportedEncodingException {
        log.info("sendEmail()");
        String email = mRepo.selectMmail(mid);
        MimeMessage emailForm = createEmailForm(email);
        emailSender.send(emailForm);
        return authNum;
    }

    private MimeMessage createEmailForm(String email)
            throws MessagingException,
            UnsupportedEncodingException{
        log.info("createEmailForm()");
        createCode();

        String setFrom = "heonamseok60@gmail.com";
        String title = "인증 번호";

        MimeMessage message = emailSender.createMimeMessage();
        message.addRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject(title);
        message.setFrom(setFrom);

        String body = "<h3>요청하신 인증 번호입니다.</h3>" +
                "<h1>" + authNum + "</h1>" +
                "<h3>감사합니다.</h3>";
        message.setText(body, "UTF-8", "html");

        return message;
    }

    private void createCode() {
        Random random = new Random();
        StringBuffer key = new StringBuffer();

        for(int i = 0; i < 8; i++){
            int index = random.nextInt(3);
            switch (index) {
                case 0:
                    key.append((char) (random.nextInt(26) + 97));
                    break;
                case 1:
                    key.append((char) (random.nextInt(26) + 65));
                    break;
                case 2:
                    key.append(random.nextInt(9));
                    break;
            }
        }
        authNum = key.toString();
    }

    public String changePass(MemberDto memberDto){
        log.info("changePass()");
        String result = null;

        String epwd = encoder.encode(memberDto.getMpwd());
        Member member = mRepo.findById(memberDto.getMid()).get();
        member.setMpwd(epwd);

        try {
            mRepo.save(member);
            result = "ok";
        } catch (Exception e) {
            e.printStackTrace();
            result = "fail";
        }

        return result;
    }

    // ★ 수정된 socialCheck ★
    public Map<String, Object> socialCheck(MemberDto memberDto) {
        log.info("socialCheck() - memberDto: {}", memberDto);
        Map<String, Object> result = new HashMap<>();

        String mid = memberDto.getMid();
        boolean exists = mRepo.existsById(mid);
        result.put("exists", exists);

        if (exists) {
            result.put("member", getMember(mid));
        }

        return result;
    }

    // 소셜 회원가입 처리
    public String socialJoin(MemberDto memberDto) {
        log.info("socialJoin()");
        String result = null;

        try {
            if (memberDto.getMpwd() != null && !memberDto.getMpwd().isEmpty()) {
                String epwd = encoder.encode(memberDto.getMpwd());
                memberDto.setMpwd(epwd);
            } else {
                memberDto.setMpwd("");
            }

            Member member = mapper.map(memberDto, Member.class);
            mRepo.save(member);
            result = "ok";
        } catch (Exception e) {
            log.error("socialJoin error: ", e);
            result = "fail";
        }

        return result;
    }
}
