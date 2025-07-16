import React, { useEffect, useState } from 'react';
import './scss/SubMenu4.scss'; // SCSS 파일 임포트

const SubMenu4 = () => {
  const [showJobInfo, setShowJobInfo] = useState(false); // 채용정보 토글 상태
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState(null); // 선택된 장소에 맞는 채용정보 타이틀
  const [selectedJobList, setSelectedJobList] = useState([]); // 선택된 장소에 맞는 채용정보 리스트

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const { kakao } = window;

        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.49228528433782, 126.72563349649552),
          level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        const places = {
          '부평 테마의거리': {
            lat: 37.49228528433782,
            lng: 126.72563349649552,
            info: '채용정보입니다.',
            jobInfo: '부평 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '구월 로데오': {
            lat: 37.44437542191481,
            lng: 126.70196438283,
            info: '채용정보입니다.',
            jobInfo: '구월 채용정보',
            jobs: [
              { company: '스타벅스 구월점', title: '구월점 파트타이머', location: '구월동', time: '09:00 ~ 18:00', salary: '시급 9,000', date: '4/23' },
              // 여기에 다른 구월 채용 정보 추가 가능
            ],
          },
          '계산 택지': {
            lat: 37.53503320099279,
            lng: 126.73748417654167,
            info: '채용정보입니다.',
            jobInfo: '계산동 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '송도 타임스페이스': {
            lat: 37.38339764952736,
            lng: 126.64286969647866,
            info: '채용정보입니다.',
            jobInfo: '송도동 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '검단사거리': {
            lat: 37.60201986787247,
            lng: 126.6552182450603,
            info: '채용정보입니다.',
            jobInfo: '검단 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '청라 커넬웨이': {
            lat: 37.53280847307609,
            lng: 126.65156028816843,
            info: '채용정보입니다.',
            jobInfo: '청라 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '주안 2030': {
            lat: 37.46297215060264,
            lng: 126.68120547150536,
            info: '채용정보입니다.',
            jobInfo: '주안 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '도화 앨리웨이': {
            lat: 37.46984419982402,
            lng: 126.6639936485931,
            info: '채용정보입니다.',
            jobInfo: '도화 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          '동인천 맥도날드': {
            lat: 37.47461399874791,
            lng: 126.63045273474071,
            info: '채용정보입니다.',
            jobInfo: '동인천 채용정보',
            jobs: [
              { company: '써브웨이 부평점', title: '부평점 주말(토,일) 파트타이머', location: '부평구 부평동', time: '10:00 ~ 15:00', salary: '시급 10,030', date: '4/22' },
              // 여기에 다른 부평 채용 정보 추가 가능
            ],
          },
          // 다른 장소에 대해서도 채용정보를 추가
        };

        const addMarker = (placeName, place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          const marker = new kakao.maps.Marker({ position });
          marker.setMap(map);
        };

        // 모든 마커를 지도에 추가
        Object.keys(places).forEach((placeName) => {
          addMarker(placeName, places[placeName]);
        });

        // 핫플레이스 클릭 시 마커 나타내고 채용정보 표시
        const handlePlaceClick = (placeName) => {
          const place = places[placeName];
          if (place) {
            const position = new kakao.maps.LatLng(place.lat, place.lng);
            map.setCenter(position); // 해당 위치로 지도 이동
            setSelectedPlace(placeName); // 선택된 장소 이름 저장
            setSelectedPlaceInfo(place.jobInfo); // 해당 장소의 채용정보 타이틀 저장
            setSelectedJobList(place.jobs); // 해당 장소의 채용정보 리스트 저장
            setShowJobInfo(true); // 채용정보 표시
          }
        };

        // 각 핫플레이스 글씨 클릭 시 이벤트 추가
        document.querySelectorAll('.place-link').forEach((link) => {
          link.addEventListener('click', (e) => {
            const placeName = e.target.innerText;
            handlePlaceClick(placeName);
          });
        });
      } else {
        console.error('카카오 맵 API가 로드되지 않았습니다.');
      }
    };

    if (window.kakao) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=2522ad989c24a08049129eee43f375e8';
      script.async = true;
      script.onload = () => {
        console.log('카카오 맵 API가 로드되었습니다.');
        loadKakaoMap();
      };
      script.onerror = () => console.error('카카오 맵 API 로드 실패');
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="sub-menu">
      {/* 지도 + 핫플레이스를 묶는 flex row 영역 */}
      <div className="content-row">
        <div className="map-container">
          <div id="map" className="map"></div>
        </div>

        <div className="place-list">
          <h2 className="title">인천 핫플레이스</h2>
          <ul className="places">
            <li><a href="#" className="place-link">부평 테마의거리</a></li>
            <li><a href="#" className="place-link">구월 로데오</a></li>
            <li><a href="#" className="place-link">계산 택지</a></li>
            <li><a href="#" className="place-link">송도 타임스페이스</a></li>
            <li><a href="#" className="place-link">검단사거리</a></li>
            <li><a href="#" className="place-link">청라 커넬웨이</a></li>
            <li><a href="#" className="place-link">주안 2030</a></li>
            <li><a href="#" className="place-link">도화 앨리웨이</a></li>
            <li><a href="#" className="place-link">동인천 맥도날드</a></li>
          </ul>
        </div>
      </div>

      {/* 일반 채용정보 (핫플레이스 클릭 시 표시) */}
      {showJobInfo && (
        <div className="bp">
          <h2>{selectedPlaceInfo}</h2>
          <p>
            총 <strong>{selectedJobList.length}건</strong>
          </p>
          <select title='정렬조건'>
            <option value>정렬조건</option>
            <option value>등록일순</option>
            <option value>시급순</option>
            <option value>일급순</option>
            <option value>주급순</option>
            <option value>월급순</option>
            <option value>연봉순</option>
          </select>
          <select title='게시물보기'>
            <option value>20개씩 보기</option>
            <option value>30개씩 보기</option>
          </select>
          <table>
            <colgroup>
              <col width="74px"></col>
              <col width="*"></col>
              <col width="110px"></col>
              <col width="121px"></col>
              <col width="128px"></col>
              <col width="137px"></col>
            </colgroup>
            <thead>
              <tr>
                <th scope='col'>기업명/공고 제목</th>
                <th scope='col'>근무지</th>
                <th scope='col'>근무시간</th>
                <th scope='col'>급여</th>
                <th scope='col'>등록일</th>
              </tr>
            </thead>
            <tbody>
              {selectedJobList.map((job, index) => (
                <tr key={index}>
                  <td>
                    <a>
                      <div>
                        <span>{job.company}<br /></span>
                        <span>{job.title}</span>
                      </div>
                    </a>
                  </td>
                  <td>{job.location}</td>
                  <td>{job.time}</td>
                  <td>
                    <span>{job.salary}</span>
                  </td>
                  <td>
                    <span>{job.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubMenu4;