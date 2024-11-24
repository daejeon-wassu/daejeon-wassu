import style from "./communityheader.module.css";
import ToCommunity from "./tocommunity";

export default function CommunityHeader() {
  return (
    <div>
      <p className={style.text}>다양한 관광지에 대한 소감,</p>
      <div className={style.header_content_container}>
        <p className={style.green_text}>커뮤니티 🧑‍🤝‍🧑</p>
        <ToCommunity />
      </div>
    </div>
  );
}
