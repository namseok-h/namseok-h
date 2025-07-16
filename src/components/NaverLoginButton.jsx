// src/components/NaverLoginButton.jsx
import { useEffect } from 'react';

function NaverLoginButton() {
  useEffect(() => {
    // 네이버 SDK 스크립트 동적 추가
    const script = document.createElement("script");
    script.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "HJjToCdzXdUtMwcVIx4M", // 네이버 앱에서 발급받은 Client ID
        callbackUrl: "http://localhost/naver-redirect", // 리디렉션 URI
        isPopup: false, // 팝업이 아니라 페이지 리디렉션 방식
        loginButton: { color: "green", type: 3, height: 50 }, // 네이버 버튼 스타일
        authType: "reprompt" // 자동 로그인 방지 옵션
      });
      naverLogin.init();
    };
  }, []);

  return <div id="naverIdLogin" />;
}

export default NaverLoginButton;