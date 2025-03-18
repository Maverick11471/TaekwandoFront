"use client";
import { useEffect, useState } from "react"; // useEffect와 useState를 import합니다.

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect를 사용하여 컴포넌트가 클라이언트에서 마운트된 후에 상태를 변경합니다.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 클라이언트에서만 렌더링되도록 isMounted 상태를 확인합니다.
  if (!isMounted) {
    return null; // 서버 사이드에서는 아무것도 렌더링하지 않음
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>경희대 최강 태권도</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">이메일</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@naver.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                  <Link
                    href="/findProfile"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              회원가입을 아직 안하셨나요?{" "}
              <Link href="/join" className="underline underline-offset-4">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
