package com.icia.boardserver.service;

import com.icia.boardserver.dto.PeopleDto;
import com.icia.boardserver.entity.PeopleEntity;
import com.icia.boardserver.repository.PeopleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PeopleService {

    @Autowired
    private PeopleRepository peopleRepository;

    public void savePeople(PeopleDto dto) {
        PeopleEntity entity = new PeopleEntity();
        entity.setMname(dto.getMname());
        entity.setMphone(dto.getMphone());
        entity.setMmail(dto.getMmail());
        entity.setEducation(dto.getEducation());
        entity.setPhoto(dto.getPhoto());
        entity.setPr(dto.getPr());
        peopleRepository.save(entity);
    }

}
