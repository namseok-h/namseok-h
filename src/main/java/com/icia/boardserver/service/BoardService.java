package com.icia.boardserver.service;

import com.icia.boardserver.dto.BoardDto;
import com.icia.boardserver.dto.BoardFileDto;
import com.icia.boardserver.dto.PageInfoDto;
import com.icia.boardserver.dto.ReplyDto;
import com.icia.boardserver.entity.Board;
import com.icia.boardserver.entity.BoardFile;
import com.icia.boardserver.entity.Reply;
import com.icia.boardserver.repository.BoardFileRepository;
import com.icia.boardserver.repository.BoardRepository;
import com.icia.boardserver.repository.ReplyRepository;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BoardService {
    @Autowired
    private BoardRepository bRepo;

    @Autowired
    private BoardFileRepository bfRepo;

    @Autowired
    private ReplyRepository rRepo;

    private ModelMapper mapper = new ModelMapper();

    public Map<String, Object> getBoardList(PageInfoDto pageInfo){
        log.info("getBoardList()");

        if(pageInfo.getPageNum() == null){
            pageInfo.setPageNum(1);
        }
        //페이지 당 보여질 게시글 개수
        int listCnt = 5;

        //페이징 조건 처리 객체(Pageable)
        Pageable pb = PageRequest.of((pageInfo.getPageNum() - 1),
                listCnt, Sort.Direction.DESC, "bnum");
        //PageRequest.of(페이지번호, 페이지당 게시글 개수, 정렬방식, 컬럼명)

        //페이징 처리된 게시글 목록 가져오기
        Page<Board> result = null;

        if(pageInfo.getKeyword().isEmpty()){
            //기본 목록(검색 X)
            result = bRepo.findByBnumGreaterThan(0L, pb);
        } else if(pageInfo.getColumn().equals("btitle")){
            //제목 검색 목록
            result = bRepo.findByBtitleContains(pageInfo.getKeyword(), pb);
        } else {
            //내용 검색 목록
            result = bRepo.findByBcontentContains(pageInfo.getKeyword(), pb);
        }



        //Page 결과 -> Entity 목록 -> Dto 목록으로 변환
        List<Board> eList = result.getContent();//Entity 목록
        List<BoardDto> bList = mapper.map(eList,
                new TypeToken<List<BoardDto>>(){}.getType());

        //전체 페이지 개수
        int totalPage = result.getTotalPages();

        Map<String, Object> rsMap = new HashMap<>();
        rsMap.put("bList", bList);//게시글 목록
        rsMap.put("totalPage", totalPage);
        rsMap.put("pageNum", pageInfo.getPageNum());

        return rsMap;
    }

    public String insertBoard(BoardDto post,
                              List<MultipartFile> files,
                              HttpSession session){
        log.info("insertBoard()");
        String result = null;

        //Dto -> Entity 변환
        Board board = mapper.map(post, Board.class);

        try {
            bRepo.save(board);//insert, update
            log.info("bnum : {}", board.getBnum());

            if(files != null && !files.isEmpty()){
                fileUpload(files, session, board.getBnum());
            }
            result = "ok";
        } catch (Exception e) {
            e.printStackTrace();
            result = "fail";
        }

        return result;
    }

    private void fileUpload(List<MultipartFile> files,
                            HttpSession session,
                            long bnum) throws IOException {
        log.info("fileUpload()");
        String path = session
                .getServletContext()
                .getRealPath("/");
        path += "upload/"; //파일저장 위치 : webapp/upload/
        File folder = new File(path);
        if(folder.isDirectory() == false){
            folder.mkdir();//upload 폴더가 없을 경우 생성.
        }
        
        //파일 목록에서 파일을 하나씩 꺼내서 저장 처리
        for(MultipartFile mf : files){
            //원본 파일명 꺼내기
            String oriname = mf.getOriginalFilename();

            BoardFile bf = new BoardFile();
            bf.setBforiname(oriname);//원본파일명
            bf.setBfbid(bnum);//게시글 번호

            //변경할 파일명 작성
            String sysname = System.currentTimeMillis()
                    + oriname.substring(oriname.lastIndexOf("."));
            bf.setBfsysname(sysname);

            //파일 저장
            File file = new File(path + sysname);
            mf.transferTo(file);

            //파일 정보 저장(DB)
            bfRepo.save(bf);
        }
    }

    public BoardDto getBoard(long bnum){
        log.info("getBoard()");
        
        //DB에서 게시글 가져오기
        Board board = bRepo.findById(bnum).get();
        //첨부파일 목록 가져오기
        List<BoardFile> bfList = bfRepo.findByBfbid(bnum);
        //댓글 목록 가져오기
        List<Reply> replyList = rRepo.findByRbid(bnum);

        //게시글과 파일 목록을 boardDto에 담기
        BoardDto boardDto = mapper.map(board, BoardDto.class);

        List<BoardFileDto> fList = mapper.map(bfList,
                new TypeToken<List<BoardFileDto>>(){}.getType());

        List<ReplyDto> rList = mapper.map(replyList,
                new TypeToken<List<ReplyDto>>(){}.getType());

        boardDto.setBfList(fList);
        boardDto.setReplyList(rList);

        return boardDto;
    }

    //insert, update, delete 이 세가지 작업은
    //트랜잭션을 처리해야 한다.
    @Transactional
    public String deleteBoard(long bnum, HttpSession session) {
        log.info("deleteBoard() - bnum: {}", bnum);

        try {
            // 1. 첨부파일 목록 조회
            List<BoardFile> fList = bfRepo.findByBfbid(bnum);

            // 2. 서버에 저장된 실제 파일 삭제
            deleteFiles(fList, session);

            // 3. 댓글 삭제
            rRepo.deleteByRbid(bnum);

            // 4. 첨부파일 정보(DB) 삭제
            bfRepo.deleteByBfbid(bnum);

            // 5. 게시글 삭제
            bRepo.deleteById(bnum);

            log.info("게시글 삭제 완료 - bnum: {}", bnum);
            return "ok";
        } catch (Exception e) {
            log.error("게시글 삭제 중 오류 발생 - bnum: {}", bnum, e);
            return "fail";
        }
    }

    private void deleteFiles(List<BoardFile> fList,
                             HttpSession session)
            throws Exception{
        log.info("deleteFiles()");
        String path = session
                .getServletContext()
                .getRealPath("/");
        path += "upload/";

        for(BoardFile bf : fList){
            File file = new File(path + bf.getBfsysname());
            if(file.exists()){//파일이 있으면 삭제
                file.delete();
            }
        }
    }

    //파일 다운로드 처리 메소드
    public ResponseEntity<Resource> fileDownload(BoardFileDto bfile,
                                                 HttpSession session)
            throws IOException{
        log.info("fileDownload()");
        String path = session
                .getServletContext()
                .getRealPath("/");
        path += "upload/" + bfile.getBfsysname();

        InputStreamResource fResource =
                new InputStreamResource(new FileInputStream(path));

        //파일명이 한글인 경우 utf-8로 처리
        String filename = URLEncoder.encode(bfile.getBforiname(), "UTF-8");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .cacheControl(CacheControl.noCache())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + filename)
                .body(fResource);
    }

    //개별 파일 삭제 메소드(from 수정페이지)
    public List<BoardFileDto> fileDelete(BoardFileDto bFile,
                                         HttpSession session){
        log.info("fileDelete()");
        List<BoardFileDto> bfList = null;

        try {
            //파일 삭제
            deleteFile(bFile, session);
            //파일 정보 삭제(DB)
            bfRepo.deleteById(bFile.getBfnum());
            //새 파일 목록 가져오기(게시글번호로 목록 가져오기)
            List<BoardFile> list = bfRepo.findByBfbid(bFile.getBfbid());
            //Entity list -> Dto list
            bfList = mapper.map(list,
                    new TypeToken<List<BoardFileDto>>(){}.getType());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return  bfList;
    }

    private void deleteFile(BoardFileDto bFile,
                            HttpSession session)
            throws Exception{
        log.info("deleteFile()");

        String path = session
                .getServletContext()
                .getRealPath("/");
        path += "upload/" + bFile.getBfsysname();

        File dfile = new File(path);

        if(dfile.exists()){
            dfile.delete();
        }
    }

    public List<ReplyDto> replyWrite(ReplyDto replyDto) {
        log.info("replyWrite()");

        List<ReplyDto> rList = null;

        Reply reply = mapper.map(replyDto, Reply.class);

        try {
            rRepo.save(reply);
            List<Reply> replyList = rRepo.findByRbid(replyDto.getRbid());

            rList = mapper.map(replyList,
                    new TypeToken<List<ReplyDto>>(){}.getType());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return rList;
    }
}//class end
