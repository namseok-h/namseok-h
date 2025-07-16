import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './scss/CategoryNav.scss';

const CategoryNav = (  ) => {
  const [open, setOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const nav = useNavigate();
  const id = sessionStorage.getItem("mid");

  const categories = [
    { name: '전체메뉴', path: '/menu' },
    { name: '채용정보', path: '/jobs' },
    { name: '커뮤니티', path: '/talent' },
    { name: '고객센터', path: '/help' },
  ];
  const c = () => {
        if (id !== null) {
            nav('/jobposting')
            console.log()
        } else {
            alert("로그인 후 이용가능합니다.");
            nav('/clogin')
        }
    };
  const r = () => {
        if (id !== null) {
            nav('/resumeregister')
            console.log()
        } else {
            alert("로그인 후 이용가능합니다.");
            nav('/plogin')
        }
    };

  return (
    <nav className="CategoryNav">
      <div className="nav-container">
        <div className="menu-toggle" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`menu ${open ? 'open' : ''}`}>
          {categories.map((cat) => (
            <li
              key={cat.name}
              onMouseEnter={() => setHoveredMenu(cat.name)}
              onMouseLeave={() => setHoveredMenu(null)}
              className={hoveredMenu === cat.name ? 'hovered' : ''}
            >
              <Link to={cat.path}>
                {cat.name === '전체메뉴' ? (
                  <div className="menu-icon-label">
                    <Menu size={16} style={{ marginRight: '6px' }} />
                    <span>{cat.name}</span>
                  </div>
                ) : (
                  cat.name
                )}
              </Link>

              {/* 전체메뉴 메가 드롭다운 */}
              {hoveredMenu === '전체메뉴' && (
                <div className="mega-dropdown">
                  <div className="dropdown-column">
                    <h4>채용정보</h4>
                    <ul>
                      <li><Link to="/submenu1">전체 채용정보</Link></li>
                      <li><Link to="/submenu2">지역·동네 알바</Link></li>
                      <li><Link to="/submenu3">직종별 알바</Link></li>
                      <li><Link to="/submenu4">핫플레이스 알바</Link></li>
                    </ul>
                  </div>
                  <div className="dropdown-column">
                    <h4>커뮤니티</h4>
                    <ul>
                      <li><Link to="/community/qna">알바리뷰</Link></li>
                      <li><Link to="/community/free">동네톡</Link></li>
                      <li><Link to="/community/event">이벤트</Link></li>
                    </ul>
                  </div>
                  <div className="dropdown-column">
                    <h4>고객센터</h4>
                    <ul>
                      <li><Link to="/help/notice">공지사항</Link></li>
                      <li><Link to="/help/faq">FAQ</Link></li>
                      <li><Link to="/help/contact">문의하기</Link></li>
                      <li><Link to="/help/guide">이용안내</Link></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 채용정보 드롭다운 */}
              {hoveredMenu === '채용정보' && (
                <ul className="dropdown">
                  <li><Link to="/submenu1">전체 채용정보</Link></li>
                  <li><Link to="/submenu2">지역·동네 알바</Link></li>
                  <li><Link to="/submenu3">직종별 알바</Link></li>
                  <li><Link to="/submenu4">핫플레이스 알바</Link></li>
                </ul>
              )}

              {/* 커뮤니티 드롭다운 */}
              {hoveredMenu === '커뮤니티' && (
                <ul className="dropdown">
                  <li><Link to="/community/qna">알바리뷰</Link></li>
                  <li><Link to="/community/free">동네톡</Link></li>
                  <li><Link to="/community/event">이벤트</Link></li>
                </ul>
              )}

              {/* 고객센터 드롭다운 */}
              {hoveredMenu === '고객센터' && (
                <ul className="dropdown">
                  <li><Link to="/help/notice">공지사항</Link></li>
                  <li><Link to="/help/faq">FAQ</Link></li>
                  <li><Link to="/help/contact">문의하기</Link></li>
                  <li><Link to="/help/guide">이용안내</Link></li>
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* 이력서 등록, 공고 등록 버튼 */}
        <div className="menu-buttons">
          <button to="/resumeregister" className="btn" onClick={r}>
            이력서 등록
          </button>
          <button to="/jobposting" className="btn" onClick={c}>
            공고 등록
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
