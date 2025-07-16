package com.icia.boardserver.repository;

import com.icia.boardserver.entity.Reply;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReplyRepository extends CrudRepository<Reply, Long> {
    List<Reply> findByRbid(long rbid);

    void deleteByRbid(long bnum);
}
