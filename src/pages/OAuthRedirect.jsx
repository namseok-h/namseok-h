import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // npm install qs

const OAuthRedirect = ({ sucLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      const Rest_api_key = '3c80404f7432bbd74a5968e1fb38a6cb';
      const redirect_uri = 'http://localhost/oauth'; // 카카오 개발자 콘솔 redirect URI와 일치해야 함

      const tokenRequestData = {
        grant_type: 'authorization_code',
        client_id: Rest_api_key,
        redirect_uri: redirect_uri,
        code: code,
      };

      // 1. 액세스 토큰 요청
      axios.post(
        'https://kauth.kakao.com/oauth/token',
        qs.stringify(tokenRequestData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          }
        }
      )
      .then(res => {
        const { access_token } = res.data;

        // 2. 사용자 정보 요청
        axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        })
        .then(userInfo => {
          const kakaoData = userInfo.data;
          console.log("✅ 카카오 사용자 정보:", kakaoData);

          // 안전하게 정보 추출
          const kakaoId = String(kakaoData.id); // 숫자 → 문자열로 변환
          const nickname = kakaoData.kakao_account?.profile?.nickname || "이름 없음";
          const email = kakaoData.kakao_account?.email || "이메일 없음";

          // 세션에 저장
          sessionStorage.setItem("mid", kakaoId);        // mid는 ID로
          sessionStorage.setItem("nickname", nickname);  // 닉네임은 별도 저장
          sessionStorage.setItem("email", email);

          // ✅ App의 sucLogin(mid, nickname)에 정확히 전달
          sucLogin(kakaoId, nickname);
          navigate('/');
        })
        .catch(err => {
          console.error("❌ 카카오 사용자 정보 가져오기 실패", err);
          alert("카카오 사용자 정보 요청 실패");
        });

      })
      .catch(err => {
        console.error("❌ 카카오 토큰 요청 실패", err.response ? err.response.data : err);
        alert("카카오 로그인 실패 (토큰 요청)");
      });

    } else {
      alert("카카오 인증 코드가 없습니다. 로그인 실패");
    }
  }, [navigate, sucLogin]);

  return <div>카카오 로그인 중입니다...</div>;
};

export default OAuthRedirect;