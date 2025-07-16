import React, { useCallback, useEffect, useRef, useState } from 'react';
import './scss/Update.scss';
import './scss/Input.scss';
import './scss/Textarea.scss';
import './scss/FileInput.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';

const Update = () => {
    const nav = useNavigate();

    const { state } = useLocation();
    const { bn } = state;

    const id = sessionStorage.getItem("mid");

    //수정될 게시글을 위한 state
    const [post, setPost] = useState({
        bnum: bn,
        btitle: "",
        bmid: id,
        bcontent: "",
    });

    //파일 목록 처리를 위한 state(Board.jsx의 것과 같다.)
    const [flist, setFlist] = useState([
        {
            bfnum: 0,
            bfbid: 0,
            bfsysname: "",
            bforiname: "Nothing",
            image: "",
        },
    ]);

    const { btitle, bcontent } = post;

    //서버로부터 게시글 내용 받기(처음에 한번만...)
    useEffect(() => {
        if(id === null) {//로그인 안한 경우 첫페이지로 이동.
            nav("/", { replace: true });
            return;
        }

        axios
            .get("/getBoard", { params: { bnum: bn } })
            .then( res => {
                console.log(res.data);
                const { data } = res;
                setPost(data);

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
            })
            .catch( err => {
                console.log(err);
            });
    }, []);

    const viewFlist = flist.map((f, idx) => {
        return (
            <div className='Down' key={idx}
                onClick={() => fileDelete(f)}
            >
                {f.image && <img src={f.image} alt='preview-img'/>}
                {f.bforiname}
            </div>
        );
    });

    const fileDelete = file => {
        let conf = window.confirm("삭제하시겠습니까?");

        //console.log(file);

        if(conf === false){
            alert("취소하셨습니다.");
            return;
        }

        axios
            .post("/fileDelete", file)
            .then( res => {
                console.log(res.data);

                if(res.data.length > 0){
                    let newFileList = [];

                    for(let f of res.data){
                        const newFile = {
                            ...f,
                            image: "./upload/" + f.bfsysname,
                        };
                        newFileList.push(newFile);
                    }
                    setFlist(newFileList);
                } else {
                    //모든 파일을 다 삭제했다면
                    //bforiname에 'Nothing'
                    setFlist([
                        {
                            bfnum: 0,
                            bfbid: 0,
                            bfsysname: "",
                            bforiname: "Nothing",
                            image: "",
                        },
                    ]);
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    //수정용 코드(Write.jsx와 유사)
    //파일명 처리용 state
    const [fileName, setFileName] = useState("선택된 파일이 없습니다.");
    
    //전송 데이터와 파일을 담을 FormData 생성 - useRef 사용
    const formDataRef = useRef(new FormData());

    //제목, 글내용 작성용 함수
    const onch = useCallback( e => {
        const newPost = {
            ...post,
            [e.target.name]: e.target.value,
        };
        setPost(newPost);
    }, [post]);

    //파일 선택 시 formData에 파일 목록 추가(multiple)
    const onFileChange = useCallback( e => {
        const files = e.target.files;
        let fnames = "";//span에 출력할 파일명/목록

        formDataRef.current = new FormData();

        for(let i = 0; i < files.length; i++){
            formDataRef.current.append("files", files[i]);
            fnames += files[i].name + " ";
        }

        if (fnames === ""){
            fnames = "선택된 파일이 없습니다.";
        }

        setFileName(fnames);
    }, [formDataRef.current]);

    const onWrite = useCallback( e => {
        //form 태그를 사용한 전송 시 첫줄에 다음을 넣자.
        e.preventDefault();

        //전송할 파일 이외의 데이터를 formData에 추가
        formDataRef.current.append("post", 
            new Blob([JSON.stringify(post)],
            { type: "application/json" })
        );
        
        axios
            .post("/writeProc", formDataRef.current, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then( res => {
                if(res.data === "ok"){
                    alert("수정 성공");
                    nav("/main");
                } else {
                    alert("수정 실패");
                }
            })
            .catch( err => {
                alert("전송 실패");
                console.log(err);
            })
    }, [post]);

    return (
        <div className='Update'>
            <form className='Content' onSubmit={onWrite}>
                <h1>Board Update</h1>
                <input className='Input'
                    name='btitle'
                    value={btitle}
                    placeholder='제목'
                    onChange={onch}
                    autoFocus
                    required
                />
                <textarea className='Textarea'
                    name='bcontent'
                    onChange={onch}
                    placeholder='게시글을 작성하세요.'
                    value={bcontent}
                    required
                ></textarea>
                <p>삭제할 파일을 클릭하세요.</p>
                <div className='Box'>                    
                    <div className='FileTitle'>File</div>
                    <div className='FileData'>{viewFlist}</div>
                </div>
                <div className='FileInput'>
                    <input id="upload" type='file'
                        multiple
                        onChange={onFileChange}
                    />
                    <label className='FileLabel'
                        htmlFor='upload'>
                        파일선택
                    </label>
                    <span className='FileSpan'>
                        {fileName}
                    </span>
                </div>
                <div className='Buttons'>
                    <Button type='button'
                        size='large'
                        color='gray'
                        wsize='s-10'
                        outline
                        onClick={() => { nav('/board', { state: { bn: post.bnum } }) }}
                    >
                        B
                    </Button>
                    <Button type='submit'
                        size='large'
                        wsize='s-30'
                    >
                        UPDATE
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Update;