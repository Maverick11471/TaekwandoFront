"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

export default function FindProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isMounted, setIsMounted] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 상태 추가
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [passwordError, setPasswordError] = useState(""); // 오류 메시지 상태

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  if (!isMounted) {
    return null;
  }

  const handleSendVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출로 인증번호 전송
    setShowVerification(true);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API를 통해 인증번호 검증
    setIsVerified(true); // 인증 성공 시 상태 변경
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다");
      return;
    }

    // 여기에 실제 비밀번호 재설정 API 호출 추가
    alert("비밀번호가 성공적으로 변경되었습니다!");
    await router.push("/Login"); // await 추가
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isVerified ? "비밀번호 재설정" : "비밀번호 찾기"}{" "}
            {/* 제목 동적 변경 */}
          </CardTitle>
          <CardDescription>
            {isVerified
              ? "새로운 비밀번호를 입력해주세요"
              : "이메일과 이름을 입력해주세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 1단계: 이메일/이름 입력 */}
          {!isVerified && (
            <form onSubmit={handleSendVerification}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@naver.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={showVerification}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="username">이름</Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={showVerification}
                  />
                </div>

                {!showVerification && (
                  <Button type="submit" className="w-full">
                    인증번호 전송
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* 2단계: 인증번호 입력 */}
          {showVerification && !isVerified && (
            <form onSubmit={handleVerifyCode} className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="verificationCode">인증번호</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="6자리 숫자 입력"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  인증번호 확인
                </Button>
              </div>
            </form>
          )}

          {/* 3단계: 비밀번호 재설정 */}
          {isVerified && (
            <form onSubmit={handlePasswordReset} className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(""); // 오류 메시지 초기화
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError(""); // 오류 메시지 초기화
                    }}
                  />
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                <Button type="submit" className="w-full">
                  비밀번호 재설정
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
