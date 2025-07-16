package com.icia.boardserver.repository;

import com.icia.boardserver.entity.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MemberRepository
        extends CrudRepository<Member, String> {

    //아이디 중복 체크용 메소드
    long countByMid(String mid);
    //select count(*) from member where mid='아이디값'

    @Query("select m.mmail from Member as m where m.mid=:mid")
    String selectMmail(@Param("mid") String mid);
}
