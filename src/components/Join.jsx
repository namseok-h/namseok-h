import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './scss/Join.scss';
import './scss/Input.scss';
import Button from './Button';
import axios from 'axios';

const Join = () => {
    //회원 가입 성공 시 페이지 전환을 위해 
    //useNavigate 사용
    const nav = useNavigate();

    //아이디 중복 체크 여부 확인용 변수
    let ck = false;

    //입력값 유효성 체크 및 전송을 위한 useForm 작성
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors },
    } = useForm();

    //전송 처리용 함수
    const onSubmit = form => {
        console.log(form);
        console.log(`ck : ${ck}`);

        //중복 아이디인 경우 전송하지 못하게 중단.
        if(ck === false){
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        //form을 전송
        axios
            .post("/joinProc", form)
            .then(res => {
                if(res.data === "ok"){
                    alert("가입 성공");
                    nav("/login");//성공 시 로그인 페이지로 이동.
                } else {
                    alert("가입 실패. 관리자에게 문의하세요.");
                }
            })
            .catch(err => {
                alert("전송 실패. 관리자에 문의하세요.");
                console.log(err);
            });
    };

    //아이디 중복 체크용 함수
    const idCheck = () => {
        //useForm 안에 등록된 input 태그 mid의 값을 가져옴.
        const id = watch("mid");
        if(id === ""){
            alert("아이디를 입력하세요.");
            ck = false;
            return;
        }

        //백엔드로 보낼 데이터 처리(객체 형식으로 작성)
        const sendId = { mid: id };

        axios
            .post("/idCheck", sendId)
            .then(res => {
                console.log(res.data);
                const {result, msg} = res.data;
                
                if(result === "ok"){
                    ck = true;//중복 확인 했음.                    
                } else {
                    ck = false;
                }
                alert(msg);
            })
            .catch(err => {
                alert("전송 실패");
                console.log(err);
            });
    };

    return (
        <div className='Join'>
            <form className='Content' 
                onSubmit={handleSubmit(onSubmit)}>
                <h1>회원 가입</h1>
                <input className='Input' 
                    placeholder='아이디'
                    {...register("mid", {
                        required: {
                            value: true,
                            message: "아이디는 필수 입력값입니다.",
                        },
                    })}
                />
                <span className='Error'>
                    {errors?.mid?.message}
                </span>
                <Button type="button" 
                    onClick={idCheck}
                    outline>
                    중복 확인
                </Button>
                <input className='Input' 
                    placeholder='비밀번호'
                    type='password'
                    {...register("mpwd", {
                        required: {
                            value: true,
                            message: "비밀번호는 필수 입력값입니다.",
                        },
                        minLength: {
                            value: 8,
                            message: "8자리 이상 입력해 주세요.",
                        },
                    })}
                />
                <span className='Error'>
                    {errors?.mpwd?.message}
                </span>
                <input className='Input' 
                    placeholder='이름'
                    {...register("mname", {
                        required: {
                            value: true,
                            message: "이름은 필수 입력값입니다.",
                        },
                    })}
                />
                <span className='Error'>
                    {errors?.mname?.message}
                </span>
                <input className='Input' 
                    placeholder='연락처'
                    {...register("mphone", {
                        required: {
                            value: true,
                            message: "연락처는 필수 입력값입니다.",
                        },
                        pattern: {
                            value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                            message: "010-1234-5678 형식으로 입력해주세요.",
                        },
                    })}
                />
                <span className='Error'>
                    {errors?.mphone?.message}
                </span>
                <input className='Input' 
                    placeholder='이메일'
                    {...register("mmail", {
                        required: {
                            value: true,
                            message: "이메일은 필수 입력값입니다.",
                        },
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "이메일 형식이 올바르지 않습니다.",
                        },
                    })}
                />
                <span className='Error'>
                    {errors?.mmail?.message}
                </span>
                <Button type='submit' size='large'>가입</Button>
            </form>
        </div>
    );
};

export default Join;