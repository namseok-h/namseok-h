import React, { Fragment, useCallback, useEffect, useState } from 'react';
import moment from 'moment/moment';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';
import './scss/Board.scss';

const df = date => moment(date).format("YYYY-MM-DD HH:mm:ss");

const Board = () => {
    const nav = useNavigate();

    //게시글 번호 받기(Main.jsx에서 nav의 state로 보낸 값)
    const { state } = useLocation();
    const { bn } = state || {};//게시글 번호

    //게시글 저장용 useState
    const [board, setBoard] = useState({});
    const [flist, setFlist] = useState([
        {
            bfnum: 0,
            bfbid: 0,
            bfsysname: "",
            bforiname: "Nothing",
            image: "",
        },
    ]);

    const id = sessionStorage.getItem("mid");

    //댓글용 state
    const [reply, setReply] = useState({
        rnum: 0,
        rbid: bn,
        rmid: id,
        rcontent: "",
        rrdate: "",
    });
    const [replyList, setReplyList] = useState([]);

    //컴포넌트가 보일 때 서버로부터 게시글 정보를 가져온다.
    useEffect(() => {
        if(id === null) {//로그인 안한 경우 첫페이지로 이동.
            nav("/", { replace: true });
            return;
        }

        axios
            .get("/getBoard", { params: { bnum: bn } })
            .then( res => {
                //console.log(res.data);
                const { data } = res;
                setBoard(data);

                //파일 목록 처리
                if(data.bfList.length > 0){
                    const { bfList } = data;
                    let newFileList = [];
                    for(let f of bfList){
                        const newFile = {
                            ...f,
                            image: "./upload/" + f.bfsysname,
                        };
                        newFileList.push(newFile);//파일목록 배열에 추가
                    }
                    setFlist(newFileList);
                }

                //댓글 목록 처리
                if(data.replyList.length > 0){
                    const { replyList } = data;
                    let newReplyList = [];
                    for(let r of replyList){
                        const newReply = {
                            ...r,
                        };
                        newReplyList.push(newReply);
                    }
                    setReplyList(newReplyList);
                }
            })
            .catch( err => {
                console.log(err);
            });
    }, []);

    const viewFlist = flist.map((f, idx) => {
        return (
            <div className='Down' key={idx} 
                onClick={() => onDown(f)}
            >
                {f.image && <img src={f.image} alt='preview-img'/>}
                {f.bforiname}
            </div>
        );
    });

    //파일 다운로드 처리 함수
    const onDown = f => {
        if(f.bforiname === "Nothing"){
            return;//아무작업도 안함
        }

        axios
            .get("/download", {
                params: {
                    bfsysname: f.bfsysname,
                    bforiname: f.bforiname,
                },
                responseType: "blob",
            })
            .then( res => {
                //다운 요청 -> react -> backend(spring)
                //spring -> react -> html -> 사용자
                //파일 저장 변수
                const dfile = new Blob([res.data]);

                //html 상에서 다운로드가 되도록 spring으로부터 
                //받은 파일을 변환.
                const fileObjectUrl = window.URL.createObjectURL(dfile);

                //React는 직접적으로 사용자 다운로드를 제공하지 않음.
                //그래서 <a> 태그를 생성하여 다운로드 링크를 넣어줌.
                const link = document.createElement("a");
                link.href = fileObjectUrl;
                link.style.display = "none";

                //코드 상으로 a 태그가 클릭된 것처럼 처리.
                link.download = downFileName(res);

                document.body.appendChild(link);
                link.click();//클릭이벤트를 발생시키는 함수.
                link.remove();//다운로드 처리 후 a 태그 제거.

                //다운로드가 끝난 리소스(url 객체)를 제거
                //react에서 가져온 파일을 제거
                //(spring의 파일 제거하지 않는다.)
                window.URL.revokeObjectURL(fileObjectUrl);
            })
            .catch( err => {
                console.log(err);
            });
    }

    //파일 이름 처리 함수
    const downFileName = f => {
        const dispostion = f.headers["content-disposition"];
        const fileName = decodeURI(
            dispostion
                .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
                .replace(/['"]/g, "")
        );
        return fileName;
    }

    const onDelete = useCallback(() => {
        //react에서 확인창(confirm) 사용할 때는 앞에 'window.'을
        //붙여야 한다.
        let conf = window.confirm("삭제하시겠습니까?");
        if (conf === false){
            alert("취소하셨습니다.");
            return;
        }

        axios
            .post("/deleteBoard", null, { params: { bnum: bn } })
            .then( res => {
                console.log(res.data);
                if(res.data === "ok"){
                    //삭제 성공
                    alert('삭제 완료');
                    nav("/main");
                } else {
                    //삭제 실패
                    alert("삭제 실패");
                }
            })
            .catch( err => {
                console.log(err);
            })
    }, []);

    const onUpdate = () => {
        nav("/update", { state: { bn: bn } });
    };

    const onch = useCallback((e) => {
        const newReply = {
            ...reply,
            rcontent: e.target.value,
        }
        setReply(newReply);
    }, [reply]);

    const onReplyWrite = useCallback(() => {
        //console.log(reply);

        if(reply.rcontent === ""){
            alert("작성된 내용이 없습니다.");
            return;
        }

        axios
            .post("/replyWrite", reply)
            .then( res => {
                //console.log(res.data);

                if(res.data.length > 0){
                    let newReplyList = [];
                    for(let r of res.data){
                       newReplyList.push(r);
                    }
                    setReplyList(newReplyList);

                    //댓글 textarea 초기화(내용 지우기)
                    const initReply = {
                        rnum: 0,
                        rbid: bn,
                        rmid: id,
                        rcontent: "",
                        rrdate: "",
                    };
                    setReply(initReply);
                }
            })
            .catch( err => {
                console.log(err);
            })
    }, [reply, replyList]);

    const viewRlist = replyList.map( (r, idx) => {
        return (
            <div className='ReplyItem' key={idx}>
                <div className='Rbox'>
                    <div className='Rdata'>{r.rmid}</div>
                    <div className='Rdata'>{df(r.rrdate)}</div>
                </div>
                <div className='Rbox'>
                    <pre className='Rcontent'>{r.rcontent}</pre>
                </div>
            </div>            
        );
    });

    return (
        <div className='Board'>
            <div className='Content'>
                <h1>{board.btitle}</h1>
                <div className='DataArea'>
                    <div className='Box'>
                        <div className='Title'>NO</div>
                        <div className='Data'>{board.bnum}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>Writer</div>
                        <div className='Data'>{board.bmid}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>Registry</div>
                        <div className='Data'>{df(board.rdate)}</div>
                    </div>
                    <div className='Box'>
                        <div className='FileTitle'>File</div>
                        <div className='FileData'>{viewFlist}</div>
                    </div>
                    <div className='Cont'>{board.bcontent}</div>
                </div>
                <div className='Buttons'>
                    <Button wsize='s-10' color='gray'
                        onClick={() => nav('/main')}>
                        B
                    </Button>
                    { id === board.bmid ? (
                        <>
                            <Button wsize='s-10' color='red' onClick={onUpdate}>
                                U
                            </Button>
                            <Button wsize='s-10' color='red' onClick={onDelete}>
                                D
                            </Button>
                        </>
                    ) : ("") }
                </div>
                <div className='ReplyArea'>
                        <div className='ReplyWrite'>
                            <textarea className='ReplyTextArea'
                                name='rcontent'
                                onChange={onch}
                                placeholder='댓글을 작성하세요.'
                                value={reply.rcontent}
                            ></textarea>
                            <Button wsize='s-10' color='pink'
                                onClick={onReplyWrite}
                            >
                                R
                            </Button>
                        </div>
                    <div className='ReplyList'>{viewRlist}</div>
                </div>
            </div>
        </div>
    );
};

export default Board;