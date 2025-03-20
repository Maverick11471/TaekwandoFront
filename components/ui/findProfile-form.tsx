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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z
  .object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
    username: z
      .string()
      .min(2, { message: "이름은 2자 이상이어야 합니다" })
      .max(20),
    emailVerificationCode: z
      .string()
      .length(6, { message: "인증번호는 6자리 숫자입니다." })
      .regex(/^\d+$/, { message: "인증번호는 숫자로만 입력해주세요." }),
    newPassword: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다" })
      .superRefine((value, ctx) => {
        const hasNumber = /\d/.test(value); // 숫자 포함 여부
        const hasLetter = /[a-zA-Z]/.test(value); // 영문자 포함 여부
        const hasSpecialChar = /[\W_]/.test(value); // 특수문자 포함 여부

        if (!hasNumber || !hasLetter || !hasSpecialChar) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다",
          });
        }
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"], // 오류 메시지를 confirmPassword 필드에 표시
  });

export default function FindProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isMounted, setIsMounted] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 상태 추가
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기/숨기기 상태

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      username: "",
      emailVerificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev); // 비밀번호 보기/숨기기 상태 토글
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger("email"); // 이메일 필드의 유효성 검사
    if (isValid) {
      // 실제로는 API 호출로 인증번호 전송
      setShowVerification(true);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger("emailVerificationCode"); // 인증번호 필드의 유효성 검사
    if (isValid) {
      // 실제로는 API를 통해 인증번호 검증
      setIsVerified(true); // 인증 성공 시 상태 변경
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form Data:", data);
    // 여기에 API 호출 또는 비밀번호 재설정 로직 추가
    alert("비밀번호가 성공적으로 변경되었습니다!");
    router.push("/Login");
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
                    {...form.register("email")}
                    disabled={showVerification}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="username">이름</Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    {...form.register("username")}
                    disabled={showVerification}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.username.message}
                    </p>
                  )}
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
                    {...form.register("emailVerificationCode")}
                  />
                  {form.formState.errors.emailVerificationCode && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.emailVerificationCode.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  인증번호 확인
                </Button>
              </div>
            </form>
          )}

          {/* 3단계: 비밀번호 재설정 */}
          {isVerified && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"} // 동적 타입 변경
                    required
                    {...form.register("newPassword")}
                  />
                  {form.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"} // 동적 타입 변경
                      required
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

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
