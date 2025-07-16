package com.icia.boardserver.repository;

import com.icia.boardserver.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface BoardRepository
        extends CrudRepository<Board, Long> {
    //페이징 처리된 목록을 가져오는 메소드
    // 검색이 없는 상태용(기본 목록용) 메소드
    Page<Board> findByBnumGreaterThan(long bnum, Pageable pageable);
    // 제목 검색용 메소드
    Page<Board> findByBtitleContains(String btitle, Pageable pageable);
    // 내용 검색용 메소드
    Page<Board> findByBcontentContains(String bcontent, Pageable pageable);

    //Paging 용 객체
    // 1. Page 객체 : 페이징 처리된 결과를 저장하는 객체.
    // 2. Pageable 객체 : 페이징 조건을 저장하는 객체.
    //목록을 select할 때 페이징 조건을 넣으면 해당 조건에 맞게
    //페이징 처리된 결과를 넘겨준다.
}
