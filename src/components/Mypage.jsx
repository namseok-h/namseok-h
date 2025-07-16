import React, { useCallback, useEffect, useState } from 'react';
import './scss/Mypage.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';

const Mypage = () => {
    const nav = useNavigate();
    const id = sessionStorage.getItem("mid");
    const [myInfo, setMyInfo] = useState({
        mid: id,
        mname: "",
        mphone: "",
        mmail: "",
    });

    //구조분해 할당.
    const { mid, mname, mphone, mmail } = myInfo;
    //인증 코드 저장 state
    const [code, setCode] = useState("");
    //사용자가 받은 인증 코드를 입력할 때 사용하는 state
    const [userCode, setUserCode] = useState("");

    //컴포넌트 렌더링 시 회원 정보를 받아서 화면에 출력
    useEffect(() => {
        //로그인 하지 않았을 경우 첫페이지로 강제 이동
        if(id === ""){
            nav("/", { replace:true });
            return;
        }

        axios
            .get("/getMember", { params: { mid: id } })
            .then( res => {
                console.log(res.data);
                setMyInfo(res.data);
            })
            .catch( err => {
                console.log(err);
            })
    }, []);

    const chPass = () => {
        let conf = window.confirm("비밀번호를 변경하시겠습니까?");
        if(conf === false){
            return;
        }

        axios
            .get("/mailConfirm", { params: { mid: id } })
            .then( res => {
                console.log(res.data);
                setCode(res.data);
            })
            .catch( err => {
                console.log(err);
            });
    }

    const onch = useCallback( e => {
        setUserCode(e.target.value)
    }, [userCode]);

    const onPassChange = () => {
        if(code === userCode){
            nav("/changepass", { replace: true });
    } else {
        alert("인증 번호가 맞지 않습니다.");
    }
}

    return (
        <div className='Mypage'>
            <div className='Content'>
                <h1>My Page</h1>
                <div className='DataArea'>
                    <div className='Box'>
                        <div className='Title'>ID</div>
                        <div className='Data'>{mid}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>PASS</div>
                        <div className='Data'>
                            {code === "" ? (
                                <Button wsize="s-30" color="red"
                                    outline onClick={chPass}
                                >
                                    CHANGE
                                </Button>
                            ) : (
                                <>
                                    <input className='Input' 
                                        placeholder='인증번호'
                                        onChange={onch}
                                        value={userCode}
                                    />
                                    <Button wsize="s-10"
                                        outline
                                        onClick={onPassChange}
                                    >
                                        OK
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>NAME</div>
                        <div className='Data'>{mname}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>PHONE</div>
                        <div className='Data'>{mphone}</div>
                    </div>
                    <div className='Box'>
                        <div className='Title'>EMAIL</div>
                        <div className='Data'>{mmail}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mypage;