import React, { useCallback, useEffect, useState } from 'react';
import './scss/Write.scss';
import './scss/Input.scss';
import './scss/Textarea.scss';
import './scss/FileInput.scss';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';

const Write = () => {
    const nav = useNavigate();
    const id = sessionStorage.getItem("mid");
    const [post, setPost] = useState({
        btitle: "",
        bmid: id,
        bcontent: "",
    });

    //사용상의 편의를 위해 구조분해 할당
    const { btitle, bcontent } = post;
    //파일명 처리용 state
    const [fileName, setFileName] = useState("선택된 파일이 없습니다.");

    //로그인이 되지 않았을 때, 강제로 첫페이지로 이동.
    useEffect(() => {
        if(id === null){
            nav("/", { replace:true });
            return;
        }
    }, []);

    //전송 데이터와 파일을 담을 FormData 생성
    let formData = new FormData();

    //기능 처리용 함수들
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

        for(let i = 0; i < files.length; i++){
            formData.append("files", files[i]);
            fnames += files[i].name + " ";
        }

        if (fnames === ""){
            fnames = "선택된 파일이 없습니다.";
        }

        setFileName(fnames);
    }, [formData]);

    const onWrite = useCallback( e => {
        //form 태그를 사용한 전송 시 첫줄에 다음을 넣자.
        e.preventDefault();

        //전송할 파일 이외의 데이터를 formData에 추가
        formData.append("post", 
            new Blob([JSON.stringify(post)], 
            { type: "application/json" })
        );
        
        axios
            .post("/writeProc", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then( res => {
                if(res.data === "ok"){
                    alert("작성 성공");
                    nav("/main");
                } else {
                    alert("작성 실패");
                }
            })
            .catch( err => {
                alert("전송 실패");
                console.log(err);
            })
    }, [post]);

    return (
        <div className='Write'>
            <form className='Content' onSubmit={onWrite}>
                <h1>Board Write</h1>
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
                        onClick={() => { nav('/main') }}
                    >
                        B
                    </Button>
                    <Button type='submit'
                        size='large'
                        wsize='s-30'
                    >
                        WRITE
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Write;