/* eslint-disable react/no-unescaped-entities */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (path: string) => {
    router.push(path);
    setIsOpen(false); // 메뉴 선택 시 드롭다운 닫기
  };

  return (
    <div className={`${styles.header} ${className || ""}`}>
      <div className={styles.nav}>
        <button className={styles.mainsvg}>
          <Image
            className={styles.icon}
            width={13}
            height={15}
            alt=""
            src="/--1@2x.png"
          />
          <div className={styles.div} onClick={() => navigate("/")}>
            경희대 최강 태권도
          </div>
        </button>
        <div className={styles.navigatecon}>
          <div className={styles.navigate}>
            <button
              className={styles.introduce}
              onClick={() => navigate("/introduce")}
            >
              <div className={styles.div1}>학원 소개</div>
            </button>
            <button className={styles.map} onClick={() => navigate("/map")}>
              <div className={styles.div1}>오시는길</div>
            </button>
          </div>
          <div className={styles.loginbutton}>
            <button className={styles.login} onClick={() => navigate("/login")}>
              로그인
            </button>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={styles.hamburgerbutton}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Image
                  className={styles.hamburgerbuttonIcon}
                  width={33}
                  height={24}
                  alt="메뉴"
                  src="/hamburgerbutton.svg"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10} // 헤더 아래로 10px 간격
              className={styles.dropdownContent}
            >
              <DropdownMenuItem onClick={() => navigate("/introduce")}>
                학원 소개
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/map")}>
                오시는길
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/login")}>
                로그인
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
