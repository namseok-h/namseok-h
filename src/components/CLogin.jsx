import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './scss/Input.scss';
import './scss/CLogin.scss';
import axios from 'axios';
import qs from 'qs';

const CLogin = ({ sucLogin }) => {
  const nav = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const pathname = window.location.pathname;

  const KAKAO_CLIENT_ID = '3c80404f7432bbd74a5968e1fb38a6cb';
  const KAKAO_REDIRECT_URI = 'http://localhost/oauth';
  const NAVER_CLIENT_ID = 'HJjToCdzXdUtMwcVIx4M';
  const NAVER_CLIENT_SECRET = 'PZp7U9Zi56';
  const NAVER_REDIRECT_URI = 'http://localhost/naver';

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
  const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=random`;

  const handleLogin = () => window.location.href = kakaoURL;
  const handleNaverLogin = () => window.location.href = naverURL;

  const { handleSubmit, register, formState: { errors } } = useForm();

  const sendLogin = (form) => {
    axios.post('/loginProc', form, {
      withCredentials: true,
    })
    .then(res => {
      console.log(res.data);
      const { result, msg, id, mname } = res.data;
      if (result === 'ok') {
        sucLogin(id, mname);
        sessionStorage.setItem('mid', id);
        sessionStorage.setItem('mname', mname);
        sessionStorage.setItem('mlink', '/mypage');
        nav('/');
      } else {
        alert(msg);
      }
    })
    .catch(err => {
      alert("전송 실패. 관리자에게 문의하세요.");
      console.error(err);
    });
  };

  React.useEffect(() => {
    const handleSocialLogin = async (provider) => {
      try {
        let access_token, socialId, email, nickname;

        if (provider === 'kakao') {
          const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
            grant_type: 'authorization_code',
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: KAKAO_REDIRECT_URI,
            code: code,
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          });
          access_token = tokenRes.data.access_token;

          const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${access_token}` }
          });

          socialId = userInfo.data.id;
          email = userInfo.data.kakao_account.email;
          nickname = userInfo.data.kakao_account.profile.nickname;

        } else if (provider === 'naver') {
          const state = new URL(window.location.href).searchParams.get("state");
          const tokenRes = await axios.get(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`);
          access_token = tokenRes.data.access_token;

          const userInfo = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: `Bearer ${access_token}` }
          });

          socialId = userInfo.data.response.id;
          email = userInfo.data.response.email;
          nickname = userInfo.data.response.nickname;
        }

        // ✅ 서버에 사용자 존재 여부 확인
        const checkRes = await axios.post('/socialCheck', {
          social: provider,
          socialId,
          email
        });

        if (checkRes.data.exists) {
          sucLogin(checkRes.data.nickname);
          sessionStorage.setItem('mid', checkRes.data.nickname);
          sessionStorage.setItem('mlink', '/mypage');
          nav('/');
        } else {
          // 회원가입 추가 정보 입력 페이지로 이동
          nav('/social-signup', {
            state: {
              social: provider,
              socialId,
              email,
              nickname
            }
          });
        }
      } catch (err) {
        alert(`${provider === 'kakao' ? '카카오' : '네이버'} 로그인 실패`);
        console.error(err);
      }
    };

    if (pathname === '/oauth' && code) {
      handleSocialLogin('kakao');
    } else if (pathname === '/naver' && code) {
      handleSocialLogin('naver');
    }
  }, [code, pathname]);

  return (
    <div className="CLogin">
      <form className="Content" onSubmit={handleSubmit(sendLogin)}>
        <h1>기업회원 로그인</h1>
        <input
          className="Input"
          placeholder="아이디"
          {...register("mid", { required: "아이디는 필수 입력값입니다." })}
        />
        <span className="Error">{errors?.mid?.message}</span>
        <input
          className="Input"
          placeholder="비밀번호"
          type="password"
          {...register("mpwd", {
            required: "비밀번호는 필수 입력값입니다.",
            minLength: { value: 8, message: "8자리 이상 입력해 주세요." }
          })}
        />
        <span className="Error">{errors?.mpwd?.message}</span>

        <Button type="submit" size="large">로그인</Button>

        <button type="button" className="social-btn kakao" onClick={handleLogin}>
          <img src="/images/kakao_logo.png" alt="카카오" />
          카카오 로그인
        </button>

        <button type="button" className="social-btn naver" onClick={handleNaverLogin}>
          <img src="/images/naver_logo.png" alt="네이버" />
          네이버 로그인
        </button>
      </form>
    </div>
  );
};

export default CLogin;