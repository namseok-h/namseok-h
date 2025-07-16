import React, { useState } from 'react';
import axios from 'axios';
import './scss/JobPosting.scss';
import { useNavigate } from 'react-router-dom';

const JobPosting = () => {
  const [formData, setFormData] = useState({
    title: '',
    jobCategory: '',
    employmentType: '',
    numberOfPositions: '',
    workPeriod: '',
    workDays: '',
    workTime: '',
    gender: '',
    ageRange: '',
    education: '',
    applicationMethod: '',
    resumeRequirements: {
      photoRequired: false,
      experienceRequired: false,
      coverLetterRequired: false,
    },
    companyName: '',
    companyAddress: '',
    postingRegion: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('workConditions.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        workConditions: {
          ...prev.workConditions,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      resumeRequirements: { ...prev.resumeRequirements, [name]: checked },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setImageFile(file);
    }
  };


  
  const onSubmit = async (e) => {
    e.preventDefault(); // ⬅️ 꼭 추가해야 합니다. 폼 리로드 방지
  
    const form = formData;
    const data = new FormData();

    console.log(form);
  
    data.append('title', form.title);
    data.append('jobCategory', form.jobCategory);
    data.append('employmentType', form.employmentType);
    data.append('numberOfPositions', form.numberOfPositions);
    data.append('workPeriod', form.workPeriod);
    data.append('workDays', form.workDays);
    data.append('workTime', form.workTime);
    data.append('gender', form.gender);
    data.append('ageRange', form.ageRange);
    data.append('education', form.education);
    data.append('applicationMethod', form.applicationMethod);
    data.append('companyName', form.companyName);
    data.append('companyAddress', form.companyAddress);
    data.append('contactName', form.contactName);
    data.append('contactEmail', form.contactEmail);
    data.append('contactPhone', form.contactPhone);
    data.append('pay', form.pay);
    data.append('contents', form.contents);
    data.append('resumeRequirements', JSON.stringify(form.resumeRequirements)); // 객체는 JSON으로
  
    if (imageFile) {
      data.append('photo', imageFile);
    }
  
    try {
      const res = await axios.post('/jobposting', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (res.data === 'ok') {
        alert('공고 등록이 완료되었습니다.');
        navigate('/jobposting');
      } else {
        alert('등록 실패. 관리자에게 문의하세요.');
      }
    } catch (error) {
      alert('서버 전송 실패. 다시 시도해주세요.');
      console.error(error);
    }
  };

  return (
    <div className="resume-wrapper">
      <div className="resume-container">
        <h2>공고 등록</h2>
        {submitted ? (
          <p className="resume-success">공고가 성공적으로 등록되었습니다!</p>
        ) : (
          <form className="resume-form" onSubmit={onSubmit}>
            <div className="photo-section">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="imageUpload" className="upload-btn">사진 업로드</label>
            {imageSrc && <img src={imageSrc} alt="미리보기" className="preview-img" />}
          </div>

            {/* 제목, 직종 등 나머지 필드는 생략 가능 - 이전 코드 참고 */}
            <div>
              <label>공고 제목:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <label>업 직종:</label>
              <input type="text" name="jobCategory" value={formData.jobCategory} onChange={handleChange} required />
            </div>
            <div>
              <label>고용 형태:</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                <option value="">선택</option>
                <option value="part_time">아르바이트</option>
                <option value="full_time">정규직</option>
              </select>
            </div>
            <div>
              <label>모집인원:</label>
              <select
                name="numberOfPositions"
                value={formData.numberOfPositions}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                <option value="under_10">0명(10명 미만)</option>
                <option value="1">1명</option>
                <option value="under_100">00명(100명 미만)</option>
              </select>
            </div>

            {/* 근무조건 - 근무 기간 */}
            <div>
              <label>근무 기간:</label>
              <select
                name="workPeriod"
                value={formData.workPeriod}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                <option value="over_1_year">1년 이상</option>
                <option value="6_months_to_1_year">6개월~1년</option>
                <option value="3_to_6_months">3개월~6개월</option>
                <option value="1_to_3_months">1~3개월</option>
                <option value="1_week_to_1_month">1주일~1개월</option>
                <option value="under_1_week">1주일이하</option>
                <option value="1_day">1일</option>
              </select>
            </div>

            {/* 근무 요일 */}
            <div>
              <label>근무 요일:</label>
              <select
                name="workDays"
                value={formData.workDays}
                onChange={handleChange}
                required
              >
                <option value="">요일 선택</option>
                <option value="monday">월</option>
                <option value="tuesday">화</option>
                <option value="wednesday">수</option>
                <option value="thursday">목</option>
                <option value="friday">금</option>
                <option value="saturday">토</option>
                <option value="sunday">일</option>
              </select>
            </div>

            {/* 근무 시간 */}
            <div>
              <label>근무 시간:</label>
              <select
                name="workTime"
                value={formData.workTime}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                <option value="오전">오전</option>
                <option value="오후">오후</option>
                <option value="야간">야간</option>
              </select>
            </div>

            {/* 지원 조건 - 성별 */}
            <div>
              <label>성별:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">성별 무관</option>
                <option value="male">남자</option>
                <option value="female">여자</option>
              </select>
            </div>

            {/* 연령 */}
            <div>
              <label>연령:</label>
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                required
              >
                <option value="">연령 무관</option>
                <option value="teenager">청소년 가능(만18세 이하)</option>
                <option value="adult">미성년자 불가(만18세 이상)</option>
              </select>
            </div>

            {/* 학력 */}
            <div>
              <label>학력:</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
              >
                <option value="">학력 선택</option>
                <option value="highschool">고등학교 졸업</option>
                <option value="university">대학교 졸업</option>
                <option value="graduate">대학원 졸업</option>
              </select>
            </div>

            {/* 접수 기간 방법 */}
            <div>
              <label>모집 마감일:</label>
              <input
              type='text'
                name="applicationMethod"
                value={formData.applicationMethod}
                onChange={handleChange}
                required
              >
              </input>
            </div>
            {/* 근무지 정보 */}
            <div>
              <label>근무 회사명:</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>근무지 주소:</label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                required
              />
            </div>
            {/* 담당자 정보 */}
            <div>
              <label>담당자명:</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>이메일:</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>연락처:</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>시급</label>
              <input
                type="text"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>상세 내용</label>
              <input
                type="text"
                name="contents"
                value={formData.contents}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">등록</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobPosting;
