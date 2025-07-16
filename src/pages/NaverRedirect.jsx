import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NaverRedirect({ sucLogin }) {
  const nav = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      alert("로그인에 필요한 정보가 없습니다.");
      nav("/");
      return;
    }

    // 백엔드에서 토큰 발급 + 유저 정보 조회까지 담당
    axios.post("http://localhost:8080/api/naver-login", {
      code: code,
      state: state
    })
    .then(res => {
      const nickname = res.data.nickname;
      const email = res.data.email; // 이메일도 같이 받아온다고 가정

      sessionStorage.setItem("mid", email);
      sessionStorage.setItem("nickname", nickname);

      sucLogin(email, nickname); // ✅ 닉네임도 같이 넘겨야 함
      nav("/main");
    })
    .catch(err => {
      console.error("네이버 로그인 실패", err);
      alert("네이버 로그인 실패");
      nav("/");
    });
  }, [nav, sucLogin]);

  return <div>로그인 처리 중입니다...</div>;
}

export default NaverRedirect;