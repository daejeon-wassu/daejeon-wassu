import { ReactNode } from "react";
import Header from "../../components/header";
import style from "./layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.main_container}>{children}</div>
      </div>
    </div>
  );
}
