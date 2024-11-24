import styles from "./page.module.css";
import SectionOne from "@/components/index/sectionone";
import SectionTwo from "@/components/index/sectiontwo";
import SectionThree from "@/components/index/sectionthree";
import SectionFour from "@/components/index/sectionfour";

export const metadata = {
  title: "대전왔슈",
  description: "대전을 즐겁게, 대전왔슈",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.indexcontainer}>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
      </div>
    </div>
  );
}
