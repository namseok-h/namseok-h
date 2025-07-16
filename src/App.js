import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './components/Home';
import Join from './components/Join';
import PLogin from './components/PLogin';
import Main from './components/Main';
import Mypage from './components/Mypage';
import ChangePass from './components/ChangePass';
import CategoryNav from './components/CategoryNav';
import SubMenu4 from './components/SubMenu4';
import Board from './components/Board';
import Write from './components/Write';
import ResumeRegister from './components/ResumeRegister';
import JobPosting from './components/JobPosting';
import CLogin from './components/CLogin';
import Incheon from './components/Incheon';
import Ganghwa from './components/Ganghwa';
import Gyeyang from './components/Gyeyang';
import Michuhol from './components/Michuhol';
import Namdong from './components/Namdong';
import Dong from './components/Dong';
import Bupyeong from './components/Bupyeong';
import Seo from './components/Seo';
import Yeonsu from './components/Yeonsu';
import Ongjin from './components/Ongjin';
import Jung from './components/Jung';
import OAuthRedirect from './pages/OAuthRedirect';
import NaverRedirect from './pages/NaverRedirect';
import Job from './components/Job';


function App() {
  const nav = useNavigate();

  const [loginState, setLoginState] = useState({
    logid: "",
    mlink: "/plogin",
    mname: "",
  });

  useEffect(() => {
    const id = sessionStorage.getItem("mid");
    const na = sessionStorage.getItem("mname");
    if (id !== null) {
      const newState = {
        logid: id,
        mname: na,
        mlink: "/mypage",
      };
      setLoginState(newState);
    }
  }, []);

  const sucLogin = useCallback((mid, name) => {
    const newState = {
      logid: mid,
      mname: name,
      mlink: "/mypage",
    };
    setLoginState(newState);
  }, []);

  const onLogout = useCallback(() => {
    alert("로그아웃");
    const newState = {
      logid: "",
      mlink: "/plogin",
      mname: "",
    };
    setLoginState(newState);
    sessionStorage.removeItem("mid");
    sessionStorage.removeItem("mname");
    nav("/", { replace: true });
    window.location.reload();
  }, []);

  return (
    <div className="App" style={{minHeight: '100vh', overflowY: 'auto'}}>
      <Header lstate={loginState} onLogout={onLogout} />
      <CategoryNav />
      
      {/* 메인 콘텐츠는 <main>으로 감싸서 푸터 밀기 */}
      <main>
        <Routes>
          <Route path='/' element={<Home onLogout={onLogout} />} />
          <Route path='/join' element={<Join />} />
          <Route path='/plogin' element={<PLogin sucLogin={sucLogin} />} />
          <Route path='/main' element={<Main />} />
          <Route path='/mypage' element={<Mypage />} />
          <Route path='/changepass' element={<ChangePass />} />
          <Route path='/subMenu4' element={<SubMenu4 />} />
          {/* <Route path='/home' element={<Home onLogout={onLogout} />} /> */}
          <Route path='/board' element={<Board/>}/>
          <Route path='/write' element={<Write/>}/>
          <Route path='/resumeregister' element={<ResumeRegister />}/>
          <Route path='/jobposting' element={<JobPosting  />}/>
          <Route path='/clogin' element={<CLogin sucLogin={sucLogin} />} />
          <Route path='/incheon' element={<Incheon/>}/>
          <Route path='/ganghwa' element={<Ganghwa/>}/>
          <Route path='/gyeyang' element={<Gyeyang/>}/>
          <Route path='/michuhol' element={<Michuhol/>}/>
          <Route path='/namdong' element={<Namdong/>}/>
          <Route path='/dong' element={<Dong/>}/>
          <Route path='/bupyeong' element={<Bupyeong/>}/>
          <Route path='/seo' element={<Seo/>}/>
          <Route path='/yeonsu' element={<Yeonsu/>}/>
          <Route path='/ongjin' element={<Ongjin/>}/>
          <Route path='/jung' element={<Jung/>}/>
          <Route path='/oauth' element={<OAuthRedirect sucLogin={sucLogin} />} />
          <Route path='/naver' element={<NaverRedirect sucLogin={sucLogin} />} />
          <Route path='/job' element={<Job/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


export default App;
