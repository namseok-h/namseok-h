package com.icia.boardserver.repository;

import com.icia.boardserver.entity.BoardFile;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BoardFileRepository
        extends CrudRepository<BoardFile, Long> {
    List<BoardFile> findByBfbid(long bfbid);

    void deleteByBfbid(long bfbid);
}
