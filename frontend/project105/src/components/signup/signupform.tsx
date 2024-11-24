"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import style from "./signupform.module.css";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  // 이메일 state
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 이메일 입력 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(e.target.value);
    if (!emailPattern.test(emailValue)) {
      setEmailError("이메일 형식으로 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  // 이메일 인증 요청
  const handleEmailVerification = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!emailPattern.test(email)) {
      alert("이메일 형식으로 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const emailData = { email: email };
    try {
      const response = await axios.post(
        "https://k11b105.p.ssafy.io/wassu/auth/send-verification-code",
        null,
        { params: emailData }
      );
      if (response.data) {
        alert("이메일 인증 링크가 전송되었습니다.");
      }
    } catch (error) {
      console.error("인증 요청 실패:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 입력 state
  const [password1, setPassword1] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  // 비밀번호 입력에 따라 유효성 검사
  const onChangePassword1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password1Value = e.target.value;
    setPassword1(password1Value);
    if (!passwordPattern.test(password1)) {
      setPassword1Error("비밀번호 형식에 맞게 입력해주세요.");
    } else {
      setPassword1Error("");
    }
  };

  // 비밀번호 재입력 state
  const [password2, setPassword2] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  // 비밀번호 재입력 입력할 때 값 바꾸기
  const onChangePassword2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password2value = e.target.value;
    setPassword2(password2value);
  };

  // password1과 일치 여부 확인
  useEffect(() => {
    if (password1 !== password2) {
      setPassword2Error("비밀번호가 일치하지 않습니다.");
    } else {
      setPassword2Error("");
    }
  }, [password1, password2]);

  // 성별 state
  const [gender, setGender] = useState("");

  const onClickMale = () => {
    setGender("Male");
  };

  const onClickFemale = () => {
    setGender("Female");
  };

  // 생년월일 state
  const [birth, setBirth] = useState("");
  const [birthError, setBirthError] = useState("");

  const onChangeBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const birthValue = e.target.value;
    setBirth(birthValue);
  };

  const onBirthCheck = () => {
    if (birth.length !== 4) {
      setBirthError("생년월일을 4자리로 입력해주세요. (ex. YYYY)");
    } else if (isNaN(Number(birth)) || Number(birth) < 0) {
      // 숫자가 아니거나 음수일 경우
      setBirthError("생년월일은 숫자만 입력할 수 있습니다.");
    } else {
      setBirthError(""); // 유효성 검사 통과
    }
  };

  // 닉네임 state
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nicknameValue = e.target.value;
    setNickname(nicknameValue);
  };

  const onNicknameCheck = () => {
    if (2 <= nickname.length && nickname.length <= 10) {
      setNicknameError("");
    } else {
      setNicknameError("2~10 사이로 입력해주세요");
    }
  };

  const [isCheckLoading, setCheckLoading] = useState<boolean>(false);
  const [checkError, setCheckError] = useState("");
  const [checkText, setCheckText] = useState("인증");

  // 인증번호 입력
  const [checkNumber, setCheckNumber] = useState("");
  const onChangeCheckNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNumberValue = e.target.value;
    setCheckNumber(checkNumberValue);
  };

  // 인증 성공 여부
  const [isChecked, setIsChecked] = useState("");

  // 인증번호 확인 axios
  const checkVerify = async () => {
    const checkData = {
      email: email,
      code: checkNumber,
    };
    try {
      const response = await axios.post(
        "https://k11b105.p.ssafy.io/wassu/auth/verify-code",
        null,
        { params: checkData }
      );
      if (response.data) {
        console.log("인증 성공", response.data);
        alert("메일 인증에 성공하셨습니다.");
        setIsChecked(response.data.status);
        setCheckText("인증완료");
        setCheckError("");
      }
    } catch (error) {
      console.log("인증 실패", error);
      alert("메일 인증에 실패했습니다.");
      setCheckError("인증번호가 일치하지 않습니다.");
    }
  };

  // 회원가입 요청 axios
  const handleSignup = async () => {
    // 유효성 검사
    if (isChecked !== "success") {
      alert("메일 인증을 실시해주세요.");
      return;
    }
    if (!emailPattern.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (password1 !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!passwordPattern.test(password1)) {
      alert("비밀번호 형식에 맞지 않습니다.");
      return;
    }
    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (birth.length !== 4) {
      alert("생년월일을 입력해주세요. (ex. YYYY)");
      return;
    }
    if (nickname.length < 2 || nickname.length > 10) {
      alert("닉네임은 2~10자 사이여야 합니다.");
      return;
    }

    const userData = {
      email: email,
      password: password1,
      gender: gender,
      birthYear: Number(birth),
      nickname: nickname,
    };

    console.log(userData);

    try {
      const response = await axios.post(
        "https://k11b105.p.ssafy.io/wassu/auth/signup",
        userData
      );

      if (response.data) {
        console.log("회원가입 성공", response.data);
        alert("회원가입 완료");
        router.push("/login");
      }
    } catch (error) {
      console.log("회원가입 요청 실패", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="email">
          이메일
        </label>
        <div className={style.email_container}>
          <input
            className={style.email_input}
            type="text"
            id="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className={style.auth_button}
            onClick={handleEmailVerification}
            disabled={isLoading}
          >
            {isLoading ? "전송 중..." : "전송"}
          </button>
        </div>

        {emailError && <div className={style.email_error}>{emailError}</div>}
      </div>

      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="checknumber">
          인증번호
        </label>
        <div className={style.email_container}>
          <input
            className={style.email_input}
            type="text"
            id="checknumber"
            name="checknumber"
            placeholder="인증번호를 입력해주세요."
            onChange={onChangeCheckNumber}
          />
          <button
            className={style.auth_button}
            onClick={checkVerify}
            disabled={isCheckLoading}
          >
            {checkText}
          </button>
        </div>

        {checkError && <div className={style.email_error}>{checkError}</div>}
      </div>

      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="password1">
          비밀번호
        </label>
        <input
          className={style.input_box}
          type="password"
          id="password1"
          name="password1"
          placeholder="대문자, 소문자, 특수문자를 포함하여 8~20글자로 입력해주세요"
          onChange={onChangePassword1}
        />
        {password1Error && (
          <div className={style.email_error}>{password1Error}</div>
        )}
      </div>

      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="password2">
          비밀번호확인
        </label>
        <input
          className={style.input_box}
          type="password"
          id="password2"
          name="password2"
          placeholder="비밀번호를 다시 입력해주세요"
          onChange={onChangePassword2}
        />
        {password2Error && (
          <div className={style.email_error}>{password2Error}</div>
        )}
      </div>

      <div className={style.input_container}>
        <div className={style.label_st}>성별</div>

        <div className={style.radio_container}>
          <label className={style.marginright}>
            <input
              type="radio"
              name="identity"
              value="male"
              onClick={onClickMale}
            />
            남자
          </label>

          <label>
            <input
              type="radio"
              name="identity"
              value="female"
              onClick={onClickFemale}
            />
            여자
          </label>
        </div>
      </div>

      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="birth">
          출생년도
        </label>
        <input
          className={style.input_box}
          type="text"
          id="birth"
          name="birth"
          placeholder="YYYY"
          onChange={onChangeBirth}
          onBlur={onBirthCheck}
          maxLength={4}
        />
        {birthError && <div className={style.email_error}>{birthError}</div>}
      </div>

      <div className={style.input_container}>
        <label className={style.label_st} htmlFor="nickname">
          닉네임
        </label>
        <input
          className={style.input_box}
          type="text"
          id="nickname"
          name="nickname"
          placeholder="닉네임을 입력해주세요"
          onChange={onChangeNickname}
          onBlur={onNicknameCheck}
        />
        {nicknameError && (
          <div className={style.email_error}>{nicknameError}</div>
        )}
      </div>
      <button className={style.signup_button} onClick={handleSignup}>
        회원가입
      </button>
    </div>
  );
}
