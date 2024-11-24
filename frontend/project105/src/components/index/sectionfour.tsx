import style from "./sectionfour.module.css";

export default function SectionFour() {
  return (
    <div className={style.page}>
      <div className={style.title}>부루마블</div>
      <div className={style.titledesc}>자신에게 맞는 보드판을 생성하고,</div>
      <div className={style.titledesc}>친구들과 함께 즐겨보세요</div>

      <div className={style.descbox}>
        <p className={style.desc}>나에게 맞는 보드판을 추천받고</p>
        <p className={style.desc}>최적의 경로로 보드게임을 즐겨보세요</p>
        <p className={style.desc}>멀티 모드를 지원합니다</p>
      </div>
    </div>
  );
}
