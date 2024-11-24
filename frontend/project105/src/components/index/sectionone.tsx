import style from "./sectionone.module.css";
import Buttons from "./buttons";

export default function SectionOne() {
  return (
    <div className={style.page}>
      <div className={style.left}>
        <div className={style.title}>
          <p className={style.gtext}>대전을 즐겁고, 맛있게</p>
          <p className={style.text}>대전 여행을 위한 종합 플랫폼</p>
        </div>
        <div className={style.imagebox}>
          <img className={style.logo} src="/images/logo.png" alt="" />
          <img className={style.logotext} src="/images/logotext.png" alt="" />
        </div>
        <div className={style.descbox}>
          <p className={style.desc}>여행 전 혹은, 여행 중</p>
          <p className={style.desc}>
            내가 계획한 일정을 간편하게 수정하고 꺼내보세요
          </p>
        </div>
      </div>
      <div className={style.right}>
        <div>
          <Buttons />
        </div>
      </div>
    </div>
  );
}
