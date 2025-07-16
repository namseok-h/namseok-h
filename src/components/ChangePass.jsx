import React, { useEffect } from 'react';
import './scss/ChangePass.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from './Button';

const ChangePass = () => {
    const nav = useNavigate();
    const id = sessionStorage.getItem("mid");

    useEffect( () => {
        //로그인을 안한 경우 첫페이지로 강제 이동.
        if(id === ""){
            nav("/", { replace: true });
            return;
        }
    }, []);

    const {
        handleSubmit,
        register,
        whatch,
        formState: { errors },
    } = useForm();

    const sendPass = form => {
        axios
            .post("/changePass", form)
            .then(res => {
                if(res.data === "ok"){
                    alert("비밀번호가 변경되었습니다.");
                    nav("/mypage");
                } else {
                    alert("비밀번호 변경 실패");
                }
            })
            .catch( err => {
                console.log(err);
            })
    }

    return (
        <div className='ChangePass'>
            <form className='Content' onSubmit={handleSubmit(sendPass)}
            >
                <h1>Password Change</h1>
                <input type='hidden' value={id}
                    {...register("mid")}
                />
                <input className='Input'
                    placeholder='새로운 비밀번호'
                    type='password'
                    {...register("mpwd", {
                        required: {
                            value: true,
                            message: "비밀번호는 필수 입력값입니다.",
                        },
                        minLength: {
                            value: 8,
                            message: "8자리 이상 입력해 주세요.",
                        }
                    })}
                />
                <span className='Error'>{errors?.mpwd?.message}</span>
                <Button type='submit' size='large'>
                    CHANGE
                </Button>
            </form>
        </div>
    );
};

export default ChangePass;