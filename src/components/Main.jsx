import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './scss/Main.scss';
import Table from './Table';
import TableColumn from './TableColumn';
import TableRow from './TableRow';
import Paging from './Paging';
import moment from 'moment/moment';

const df = date => moment(date).format("YYYY-MM-DD HH:mm:ss");

const Main = () => {
    const nav = useNavigate();
    const id = sessionStorage.getItem("mid");

    //글쓰기/글상세보기 화면에서 목록화면으로 돌아올 때
    //유지해야할 값들(검색컬럼, 검색키워드, 페이지번호) - state
    const [pageInfo, setPageInfo] = useState(() => {
        //sessionStorage에 저장된 유지해야할 값들을 가져와서
        //초기값으로 사용
        const pi = sessionStorage.getItem("pageInfo");
        //sessionStorage 값은 삭제.
        sessionStorage.removeItem("pageInfo");

        //sessionStorage에 값이 없으면 초기값을 설정,
        //있으면 저장된 값을 초기값으로 활용
        //pi 값을 사용할 때는 자바스크립트 객체 형태로 변경하여
        //사용해야 하기 때문에 JSON.parse를 사용.
        return pi ? JSON.parse(pi) : {
            column: "btitle",
            keyword: "",
            pageNum: 1,
        };
    });

    //select 태그에 들어갈 값
    //value 값은 spring의 DTO/Entity의 변수명과 똑같이 작성.
    const options = [
        { value: "btitle", label: "제목" },
        { value: "bcontent", label: "내용" },
    ];

    //게시글 목록 저장 state
    const [bitems, setBitems] = useState({});
    //페이징 처리용 전체 페이지 번호를 저장하는 state
    const [totalPage, setTotalPage] = useState(0);

    //서버에서 목록을 받기위한(가져오는) 함수
    const getList = useCallback(pn => {
        axios
            .get("/list", { params: {
                ...pageInfo,
                pageNum: pn,
            }})
            .then( res => {
                console.log(res.data);
                const { bList, totalPage, pageNum } = res.data;
                //목록 저장 state 변경(목록 처리)
                setBitems(bList);
                //페이지 정보 변경(페이지번호만 변경)
                const newPageState = {
                    ...pageInfo,
                    pageNum: pn,
                };
                setPageInfo(newPageState);

                //전체 페이지 개수 변경
                setTotalPage(totalPage);

                //sessionStorage에 pageInfo를 저장
                sessionStorage.setItem("pageInfo", 
                    JSON.stringify(pageInfo));
            })
            .catch( err => {
                console.log(err);
            })
    }, [pageInfo]);
        
    //Main 컴포넌트가 화면에 보일 때 작업할 일들의 코드를 작성
    useEffect(() => {
        //로그인하지 않았을 경우 이 페이지가 보이면 안됨.
        if(id === null){
            nav("/", {replace: true});
            return;      
        }

        //백엔드(spring)로부터 게시글 목록을 가져온다.
        //혹시, pageNum이 없으면 1페이지를, 있으면 해당 페이지번호를
        //넣어준다.
        pageInfo.pageNum !== null ? getList(pageInfo.pageNum) :
            getList(1);
    }, [pageInfo.pageNum]);

    //검색 관련 처리
    //검색 항목(제목, 내용) 변경 처리 함수
    const onsel = sel => {
        const newSelect = {
            ...pageInfo,
            column: sel.value,
        };
        setPageInfo(newSelect);
    };
    //검색어 입력 처리 함수
    const onch = e => {
        const newSelect = {
            ...pageInfo,
            keyword: e.target.value,
        };
        setPageInfo(newSelect);
    }
    //검색 버튼 처리 함수
    const onsearch = () => {
        //검색어가 입력되어 있는지 확인(없으면 검색 X)
        if(pageInfo.keyword === ""){
            alert("검색어를 입력하세요.");
            return;
        }
        //검색어가 포함된 목록 가져오기(가져오기 함수 사용)
        getList(1);
    }
    

    //출력할 게시글 목록(테이블) 만들기 -> 화면에 출력할 내용.
    let list = null;
    if (bitems.length === 0) {
        list = (
            <TableRow key={0}>
                <TableColumn span={4}>
                    게시글이 없습니다.
                </TableColumn>
            </TableRow>
        );
    } else {
        // 배열의 원소가 객체(Dto)일 때 map을 사용하는 방식
        // Object.valuse(객체배열).map();
        // 문자열 배열일 경우는 배열.map();
        list = Object.values(bitems).map(item => (
            <TableRow key={item.bnum}>
                <TableColumn wd="w-10">
                    {item.bnum}
                </TableColumn>
                <TableColumn wd="w-40">
                    <div onClick={() => getBoard(item.bnum)}>
                        {item.btitle}
                    </div>
                </TableColumn>
                <TableColumn wd="w-20">
                    {item.bmid}
                </TableColumn>
                <TableColumn wd="w-30">
                    {df(item.rdate)}
                </TableColumn>
            </TableRow>
        ));
    }

    //게시글 상세보기 화면으로 전환하는 함수
    const getBoard = (bnum) => {
        nav("/board", { state: { bn: bnum } });
        //'/board?bn=1'
    }

    return (
        <div className='Main'>
            <div className='Content'>
                <h1>Board List</h1>
                <div className='Sbox'>
                    <Select options={options} 
                        placeholder='선택'
                        defaultValue={options[pageInfo.column === 'btitle' ? 0 : 1]}
                        onChange={onsel}
                    />
                    <input className='Input'
                        placeholder='검색어 입력'
                        onChange={onch}
                        value={pageInfo.keyword}
                    />
                    <Button color="gray"
                        onClick={onsearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </Button>
                </div>
                <Table hNames={["NO", "Title", "Writer", "Date"]}>
                    {list}
                </Table>
                {/* 페이징 처리 컴포넌트 */}
                <Paging pageNum={pageInfo.pageNum}
                    totalPage={totalPage}
                    getList={getList}
                />
                <Button size="large"
                    wsize="s-50"
                    onClick={() => {
                        nav("/write");
                    }}
                >
                    Write
                </Button>
            </div>
        </div>
    );
};

export default Main;