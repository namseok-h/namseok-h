import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './scss/Home.scss';
import axios from 'axios';

const Home = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState({
    local: "",
    job: "",
    time: "",
  });
  const nav = useNavigate();
  // 검색 조건이 바뀔 때마다 상태 업데이트
  const onCh = (e) => {
    const newSearchState = {
      ...searchState,
      [e.target.name]: e.target.value
    };
    setSearchState(newSearchState);
  };
  console.log(searchState);
  // 검색 버튼 클릭 시 서버로 조건 보내기
  const onCk = () => {
    nav("/incheon", {state : {ss : searchState}});
  }

  // const onCk = async () => {
  //   try {
  //     const response = await axios.get('/getJobList', {
  //       params: searchState, // 여기가 핵심입니다
  //     });
  //     console.log(response.data);
  //     nav("/incheon", { state: { Incheon: response.data } });
  //   } catch (error) {
  //     console.error("Error fetching job data:", error);
  //   }
  // };

  useEffect(() => {
    const sessionId = sessionStorage.getItem('mname');
    if (sessionId) {
      setUserId(sessionId);
    }
  }, []);

  const handleCLoginClick = () => {
    if(activeTab === "personal")
      navigate('/plogin');
    else
      navigate('/clogin')
  };

  return (
    <main className="HomeMain">
      <div className="home-wrapper">
        <div className="home-container">
          <div className="login-banner-wrapper">
            <div className="login-box">
              <div className="tab-header">
                {!userId && (
                  <>
                    <div
                      className={`tab-item ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      <FaUser /> 개인회원
                    </div>
                    <div
                      className={`tab-item ${activeTab === 'company' ? 'active' : ''}`}
                      onClick={() => setActiveTab('company')}
                    >
                      <FaBuilding /> 기업회원
                    </div>
                  </>
                )}
              </div>

              <div className="tab-content">
                {!userId ? (
                  <div className="login-option">
                    <h3>{activeTab === 'personal' ? '개인회원 로그인' : '기업회원 로그인'}</h3>
                    <button className="login-btn" onClick={handleCLoginClick}>
                      로그인
                    </button>
                  </div>
                ) : (
                  <div className="login-option">
                    <h3>환영합니다, <strong>{userId}</strong>님!</h3>
                    <button className="logout-btn" onClick={onLogout}>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="login-ad-banner">
              <img src="/images/banner.jpg" alt="광고 배너" />
            </div>
          </div>

          <div className="job-search-area">
            <h3>맞춤 알바 찾기</h3>
          <div className="job-search">
            <select className="search-dropdown" onChange={onCh} name='local'>
              <option value="">지역구, 군 선택</option>
              <option value="계양구">계양구</option>
              <option value="강화군">강화군</option>
              <option value="남동구">남동구</option>
              <option value="동구">동구</option>
              <option value="미추홀구">미추홀구</option>
              <option value="부평구">부평구</option>
              <option value="서구">서구</option>
              <option value="연수구">연수구</option>
              <option value="옹진군">옹진군</option>
              <option value="중구">중구</option>
            </select>
            <select className="search-dropdown" onChange={onCh} name='job'>
              <option value="">업직종 선택</option>
              <option value="카페">카페</option>
              <option value="편의점">편의점</option>
              <option value="홀">식당(홀)</option>
              <option value="주방">식당(주방)</option>
            </select>
            <select className="search-dropdown" onChange={onCh} name='day'>
              <option value="">근무시간 선택</option>
              <option value="오전">오전</option>
              <option value="오후">오후</option>
              <option value="야간">야간</option>
            </select>
            <button className="search-btn" onClick={onCk}>검색</button>
            </div>

            <div className="area-jobs">
              <h4>📍 인천 지역 알바 바로가기</h4>
                  <div className="regions">
                      <button onClick={() => nav('/gyeyang')}>계양구</button>
                      <button onClick={() => nav('/ganghwa')}>강화군</button>
                      <button onClick={() => nav('/jung')}>중구</button>
                      <button onClick={() => nav('/dong')}>동구</button>
                      <button onClick={() => nav('/seo')}>서구</button>
                      <button onClick={() => nav('/yeonsu')}>연수구</button>
                      <button onClick={() => nav('/bupyeong')}>부평구</button>
                      <button onClick={() => nav('/namdong')}>남동구</button>
                      <button onClick={() => nav('/michuhol')}>미추홀구</button>
                      <button onClick={() => nav('/ongjin')}>옹진군</button>
                  </div>
                  </div>
          </div>

          <div className="recommended-jobs">
            <h3>추천 채용 공고</h3>
            <div className="job-cards">
              <div className="job-card">
                <h4>스타벅스 인천점</h4>
                <p>바리스타 모집 (시급 11,000원)</p>
                <span>미추홀구 · 주말</span>
              </div>
              <div className="job-card">
                <h4>롯데리아 부평점</h4>
                <p>매장직원 모집 (시급 10,500원)</p>
                <span>부평구 · 평일</span>
              </div>
            </div>
          </div>

          <div className="alba-talk-section">
            <h3>동네톡</h3>
            <div className="alba-talk-cards">
              <div className="alba-talk-card">
                <h4>미추홀구</h4>
                <p>“편하게 일하면서 돈도 잘 벌었어요. 특히 동료들이 좋아요!”</p>
                <span>- 홍길동</span>
              </div>
              <div className="alba-talk-card">
                <h4>남동구</h4>
                <p>“쉬운 업무였고, 시간도 잘 맞춰줘서 좋았어요.”</p>
                <span>- 김민수</span>
              </div>
              <div className="alba-talk-card">
                <h4>부평구</h4>
                <p>“근무시간이 유동적이라 재밌게 일할 수 있었어요!”</p>
                <span>- 이지은</span>
              </div>
            </div>
          </div>

          <div className="notice-banner">
            <Link to="/event/starbucks">[이벤트] 회원가입하면 스타벅스 기프티콘 증정!</Link>
          </div>
        </div>

        <div className="trending-keywords sticky">
          <h3>실시간 인기 검색어</h3>
          <ul>
            <li><Link to="/search?keyword=카페 알바">카페</Link></li>
            <li><Link to="/search?keyword=편의점">편의점</Link></li>
            <li><Link to="/search?keyword=주말 알바">주말</Link></li>
            
            <li><Link to="/michuhol">미추홀구</Link></li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Home;