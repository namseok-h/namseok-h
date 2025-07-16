import React from 'react';
import classNames from 'classnames';
import './scss/Paging.scss';

const Paging = ({ pageNum, totalPage, getList }) => {
    const pageCnt = 5;

    let curGroup = Math.floor(
        pageNum % pageCnt > 0 ? pageNum / pageCnt + 1 :
                                pageNum / pageCnt
    );
    let start = curGroup * pageCnt - (pageCnt - 1);
    let end = (curGroup * pageCnt >= totalPage) ?
                totalPage : curGroup * pageCnt;
    let makePage = totalPage > end ? 
                pageCnt : totalPage - start + 1;
   
    
    // DB에 내용이 하나도 없을 경우 페이지번호가 
    // 안나오는 것을 방지하여 '1'이 나오도록 처리.
    if(makePage <= 0){ 
        makePage = 1;
    }
    //console.log(makePage);

    //페이지 번호(버튼) 목록 작성.
    //map을 사용하여 일정 횟수만큼 반복적으로 요소를 생성하는 방식.
    const pageList = new Array(makePage)
                            .fill().map((_, idx) => {
        if (idx + start === pageNum){
            //현재 보이는 페이지의 번호(링크 X)
            return (
                <div className={classNames("Number", "cur")} 
                    key={idx + start}>
                    {idx + start}
                </div>
            );
        } else {
            //다른 페이지 번호(링크 O)
            return (
                <div className='Number'
                    key={idx + start}
                    onClick={() => onck(idx + start)}
                >
                    {idx + start}
                </div>
            );
        }
    });

    //console.log(pageList);
    //이전 버튼 처리
    if(start !== 1){
        pageList.unshift(
            <div className='Number' key={start - 1}
                onClick={() => onck(start - 1)}
            >
                &lt;
            </div>
        );
    }

    //다음 버튼 처리
    if(end !== totalPage){
        pageList.push(
            <div className='Number' key={end + 1}
                onClick={() => onck(end + 1)}
            >
                &gt;
            </div>
        );
    }

    //페이지 전환 함수
    const onck = pnum => {
        getList(pnum);
    };

    return (
        <div className='Paging'>
            {pageList}
        </div>
    );
};

export default Paging;