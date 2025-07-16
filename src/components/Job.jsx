import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './scss/Job.scss';

const Job = () => {
    const nav = useNavigate();

    //게시글 번호 받기(Main.jsx에서 nav의 state로 보낸 값)
    const { state } = useLocation();
    const { bn } = state || {};//게시글 번호
    console.log(bn);
    const [job, setJob] = useState([
        {
            jnum: 0,
            title: "",
            jobCategory: "",
            employmentType: "",
            numberOfPositions: "",
            workPeriod: "",
            workDays: "",
            workTime: "",
            gender: "",
            ageRange: "",
            education: "",
            applicationMethod: "",
            companyName: "",
            companyAddress: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            pay: "",
            contents: "",
        },
    ]);
    
    useEffect(() => {
        axios
        .get("getJob", { params: {jnum: bn}})
        .then( res => {
            const { data } = res;
            setJob(data);
        }) 
        .catch( err => {
            console.log(err);
        })
    }, []);
    return (
        <div className='Board'>
            <div className='Content'>
                <h1>상세 정보</h1>
                <div className='DataArea'>
                    <div className='Box'>
                        <div className='Title'>공고 제목</div>
                        <div className='Data'>{job.title}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>업직종</div>
                        <div className='Data'>{job.jobCategory}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>고용 형태</div>
                        <div className='Data'>{job.employmentType}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>모집 인원</div>
                        <div className='Data'>{job.numberOfPositions}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>근무 기간</div>
                        <div className='Data'>{job.workPeriod}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>근무 요일</div>
                        <div className='Data'>{job.workDays}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>근무 시간</div>
                        <div className='Data'>{job.workTime}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>성별</div>
                        <div className='Data'>{job.gender}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>연령</div>
                        <div className='Data'>{job.ageRange}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>학력</div>
                        <div className='Data'>{job.education}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>모집 마감일</div>
                        <div className='Data'>{job.applicationMethod}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>근무 회사명</div>
                        <div className='Data'>{job.companyName}</div>
                    </div>
                     <div className='Box'>
                        <div className='Title'>근무지 주소</div>
                        <div className='Data'>{job.companyAddress}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>담당자명</div>
                        <div className='Data'>{job.contactName}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>이메일</div>
                        <div className='Data'>{job.contactEmail}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>연락처</div>
                        <div className='Data'>{job.contactPhone}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>시급</div>
                        <div className='Data'>{job.pay}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>상세 내용</div>
                        <div className='Data'>{job.contents}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Job;