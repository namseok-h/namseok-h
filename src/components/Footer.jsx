import './scss/Footer.scss';

function Footer() {
    return (
      <div className="Footer">

        <div className="footer-wrapper">
          <div className="footer-top">
            <ul className="footer-links">
              <li><a href="#">회사소개</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#"><strong>개인정보처리방침</strong></a></li>
              <li><a href="#">고객센터</a></li>
              <li><a href="#">제휴문의</a></li>
            </ul>
          </div>
        
          <div className="footer-info">
            <p>
                (주)알바인 | 대표이사 허남석 | 인천광역시 **구 **로 ***번지, *층<br />
                사업자등록번호: 123-45-67890 | 통신판매업신고: 제2025-인천**-0000호<br />
                고객센터: 1588-1234 (평일 09:00 ~ 18:00) | 이메일: *****@albain.co.kr
            </p>
          </div>
         
  
          <div className="footer-bottom">
            ©albain Inc. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  export default Footer;
  