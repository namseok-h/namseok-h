import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Paging from './Paging';
import './scss/Incheon.scss';
import { useNavigate } from 'react-router-dom';

const Jung = () => {
    const nav = useNavigate();
    const getJob = (jnum) => {
        console.log(jnum);
        nav("/job", { state: { bn: jnum } });
    };
    const [jitems, setJitems] = useState({});
    const [pinfo, setPinfo] = useState({
        local: "중구",
        pageNum: 1,
    });
    const [totalPage, setTotalPage] = useState(0);

    const getList = useCallback(pn => {
        axios
            .get("/companyaddress", { params: {
                ...pinfo,
                pageNum: pn,
            }})
            .then( res => {
                console.log(res.data);
                const { jList, totalPage, pageNum } = res.data;
                //목록 저장 state 변경(목록 처리)
                setJitems(jList);
                
                //페이지 정보 변경(페이지번호만 변경)
                const newPageState = {
                    ...pinfo,
                    pageNum: pageNum,
                };
                setPinfo(newPageState);

                //전체 페이지 개수 변경
                setTotalPage(totalPage);

                //sessionStorage에 pageInfo를 저장
                sessionStorage.setItem("pinfo", 
                    JSON.stringify(pinfo));
            })
            .catch( err => {
                console.log(err);
            })
    }, [pinfo]);

    useEffect(() => {
            pinfo.pageNum !== null ? getList(pinfo.pageNum) :
                getList(1);
        }, [pinfo.pageNum]);

    let list = null;
    if (jitems.length === 0) {
        list = (
            <tr key={0}>
                <td span={5}>
                    등록된 공고가 없습니다.
                </td>
            </tr>
        );
    } else {
        // 배열의 원소가 객체(Dto)일 때 map을 사용하는 방식
        // Object.valuse(객체배열).map();
        // 문자열 배열일 경우는 배열.map();
        list = Object.values(jitems).map((job,index) => (
            <tr key={index}>
              <td>
                <a>
                  <div className="job-title" onClick={() => getJob(job.jnum)}>{job.title}</div>
                  <div className="company-name">{job.companyName}</div>
                </a>
              </td>
              <td>{job.companyAddress}</td>
              <td>{job.workTime}</td>
              <td>{job.pay}</td>
              <td>{job.applicationMethod}</td>
            </tr>
            
        ));
    }
    return (
        <div className="job-list-wrapper">
            <h2>중구 알바 정보</h2>
            <p>총 <strong>{jitems.length}건</strong></p>
            <table className="job-table">
                <thead>
                    <tr>
                        <th>공고 제목</th>
                        <th>근무지</th>
                        <th>근무 시간</th>
                        <th>시급</th>
                        <th>마감일</th>
                    </tr>
                </thead>
                {list}
            </table>
            <Paging pageNum={pinfo.pageNum}
                    totalPage={totalPage}
                    getList={getList}
                />
        </div>
    );
};

export default Jung;