import SectionTwoPart from "./sectiontwopart";
import style from "./sectiontwo.module.css";

export default function SectionTwo() {
  return (
    <div className={style.page}>
      <div className={style.header}>
        <p className={style.text1}>대전 관광지 검색</p>
        <p className={style.text2}>대전 관광 명소를 검색하고,</p>
        <p className={style.text2}>다양한 관광지를 추천받으세요</p>
      </div>
      <SectionTwoPart />
    </div>
  );
}
