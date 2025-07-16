import React, { useState } from 'react';
import './scss/ResumeRegister.scss';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeRegister = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setImageFile(file);
    }
  };

  const onSubmit = async (form) => {
    const formData = new FormData();
    formData.append('mname', form.mname);
    formData.append('mphone', form.mphone);
    formData.append('mmail', form.mmail);
    formData.append('education', form.education);
    formData.append('pr', form.pr);

    if (imageFile) {
      formData.append('photo', imageFile);
    }

    try {
      const res = await axios.post('/resumeProc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data === 'ok') {
        alert('이력서 등록이 완료되었습니다.');
        navigate('/resumeregister');
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
        <h2>이력서 작성</h2>
        <form className="resume-form" onSubmit={handleSubmit(onSubmit)}>
          {/* 사진 업로드 */}
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

          {/* 기본 정보 입력 */}
          <div>
            <label>이름</label>
            <input
              type="text"
              placeholder="홍길동"
              {...register("mname", { required: "이름은 필수 입력입니다." })}
            />
            <span className="error">{errors?.mname?.message}</span>
          </div>

          <div>
            <label>연락처</label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              {...register("mphone", {
                required: "연락처는 필수 입력입니다.",
                pattern: {
                  value: /^01([0-9])-?([0-9]{4})-?([0-9]{4})$/,
                  message: "010-1234-5678 형식으로 입력해주세요."
                }
              })}
            />
            <span className="error">{errors?.mphone?.message}</span>
          </div>

          <div>
            <label>이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              {...register("mmail", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "이메일 형식이 올바르지 않습니다."
                }
              })}
            />
            <span className="error">{errors?.mmail?.message}</span>
          </div>

          <div>
            <label>학력</label>
            <input
              type="text"
              placeholder="서울대학교 컴퓨터공학과"
              {...register("education", { required: "학력은 필수 입력입니다." })}
            />
            <span className="error">{errors?.education?.message}</span>
          </div>

          <div>
            <label>자기소개</label>
            <textarea
              placeholder="자신을 간단히 소개해주세요"
              rows="5"
              {...register("pr")}
            />
          </div>

          <button type="submit">제출</button>
        </form>
      </div>
    </div>
  );
};

export default ResumeRegister;
