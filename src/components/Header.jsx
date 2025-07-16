import { faHouse } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './scss/Header.scss';
import logoImg from '../images/logo.png';

const Header = ({ lstate, onLogout }) => {
    const nav = useNavigate();
    const { logid, mlink, mname} = lstate;
    const homeLink = logid === '' ? '/' : '/';

    const [searchWord, setSearchWord] = useState('');

    const goFirst = () => {
        nav(homeLink);
        sessionStorage.removeItem("pageInfo");
        window.location.reload(); // 필요한 경우 유지
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchWord.trim() === '') {
            alert('검색어를 입력하세요.');
            return;
        }
        // 검색 결과 페이지로 이동 처리
        nav(`/search/Search?section=ALL&srchType=ALL&clsType=search&EasySearch=mainSearch&wsSrchWord=${encodeURIComponent(searchWord)}`);
    };

    return (
        <div className='Header'>
            <div className='Content'>
            <div className="LogoWrapper" onClick={goFirst}>
                <img src={logoImg} alt="로고" className="LogoImg" />
            </div>
                

                <div className='headerSearch header__search'>
                    <form onSubmit={handleSearchSubmit}>
                        <input type="hidden" name="section" value="ALL" />
                        <input type="hidden" name="srchType" value="ALL" />
                        <input type="hidden" name="clsType" value="search" />
                        <input type="hidden" name="EasySearch" value="mainSearch" />
                        <div className="search">
                            <span className="searchInput wordSearch">
                                <input
                                    type="text"
                                    id="wsSrchWord"
                                    name="wsSrchWord"
                                    title="통합 검색"
                                    value={searchWord}
                                    onChange={(e) => setSearchWord(e.target.value)}
                                    maxLength="20"
                                    autoComplete="off"
                                />
                            </span>
                            <button type="submit" className="searchSubmit">검색</button>
                        </div>
                    </form>
                </div>

                <div className='Menu'>
                    <div className='Item'>
                        {logid !== '' ? (
                            <span onClick={onLogout}>로그아웃</span>
                        ) : (
                            <Link to='/join'>회원가입</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
