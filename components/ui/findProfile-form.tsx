"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InputForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [steps, setSteps] = useState<"auth" | "password">("auth");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailFieldDisabled, setIsEmailFieldDisabled] = useState(false);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const isVerificationCompleteRef = useRef(isVerificationComplete);
  const router = useRouter();

  // Ref 동기화
  useEffect(() => {
    isVerificationCompleteRef.current = isVerificationComplete;
  }, [isVerificationComplete]);

  const FormSchema = z
    .object({
      email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
      username: z
        .string()
        .min(2, { message: "사용자 이름은 2자 이상이어야 합니다" })
        .max(20),
      emailVerificationCode: z.string().superRefine((value, ctx) => {
        if (!isEmailFieldDisabled) return;
        if (value.length !== 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "인증번호는 6자리 숫자입니다.",
          });
        }
        if (!/^\d+$/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "인증번호는 숫자로만 입력해주세요.",
          });
        }
      }),
      password: z.string().optional(),
      secondPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (isVerificationCompleteRef.current) {
        // 비밀번호 검증
        if (!data.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호를 입력해주세요",
            path: ["password"],
          });
        } else if (data.password.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호는 8자 이상이어야 합니다",
            path: ["password"],
          });
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[\W_])/.test(data.password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "숫자, 영문자, 특수문자를 포함해야 합니다",
            path: ["password"],
          });
        }

        // 비밀번호 확인 검증
        if (!data.secondPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호 확인을 입력해주세요",
            path: ["secondPassword"],
          });
        } else if (data.password !== data.secondPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "비밀번호가 일치하지 않습니다",
            path: ["secondPassword"],
          });
        }
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      emailVerificationCode: "",
      password: "",
      secondPassword: "",
    },
  });

  // 상태 변경 시 유효성 재검사
  useEffect(() => {
    if (isVerificationComplete) {
      form.trigger(["password", "secondPassword"]);
    }
  }, [isVerificationComplete, form]);

  // 이메일 유효성 검사
  const emailValue = form.watch("email");
  useEffect(() => {
    const emailSchema = z.string().email();
    setIsEmailValid(emailSchema.safeParse(emailValue).success);
  }, [emailValue]);

  // 사용자 이름 유효성 검사
  const usernameValue = form.watch("username");
  useEffect(() => {
    const usernameSchema = z.string().min(2).max(20);
    setIsUsernameValid(usernameSchema.safeParse(usernameValue).success);
  }, [usernameValue]);

  // 인증번호 유효성 검사
  const verificationCodeValue = form.watch("emailVerificationCode");
  useEffect(() => {
    const codeSchema = z.string().length(6).regex(/^\d+$/);
    setIsVerificationCodeValid(
      codeSchema.safeParse(verificationCodeValue).success
    );
  }, [verificationCodeValue]);

  const handleSendVerificationCode = () => {
    toast.success("인증번호가 전송되었습니다.");
    setIsEmailFieldDisabled(true);
    setShowVerificationField(true);
  };

  const handleVerifyCode = () => {
    setIsVerificationComplete(true);
    setSteps("password");
    toast.success("인증 완료. 비밀번호를 재설정해주세요.");
  };

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (steps === "auth") {
      if (!showVerificationField) {
        handleSendVerificationCode();
      } else {
        handleVerifyCode();
      }
    } else {
      try {
        // 비밀번호 변경 API 호출 (가정)
        await fetch("/api/reset-password", {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            newPassword: data.password,
          }),
        });

        toast.success("비밀번호가 성공적으로 변경되었습니다.");

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push("/login"); // 로그인 페이지 경로
        }, 1000);
      } catch (error) {
        console.error("Error details:", error);
        toast.error(
          `변경 실패: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 mb-16 mt-10", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {steps === "password" ? "비밀번호 재설정" : "비밀번호 찾기"}
          </CardTitle>
          <CardDescription>
            {steps === "password"
              ? "새로운 비밀번호를 입력해주세요"
              : "이메일과 이름을 입력해주세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-5"
            >
              {/* 인증 단계 필드들 */}
              {steps === "auth" && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일 주소</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            {...field}
                            type="email"
                            disabled={isEmailFieldDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용자 이름</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="홍길동"
                            {...field}
                            disabled={isEmailFieldDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showVerificationField && (
                    <FormField
                      control={form.control}
                      name="emailVerificationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>인증번호</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="6자리 숫자 입력"
                              {...field}
                              disabled={isVerificationComplete}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      steps === "auth" &&
                      ((!showVerificationField &&
                        (!isEmailValid || !isUsernameValid)) ||
                        (showVerificationField && !isVerificationCodeValid))
                    }
                  >
                    {showVerificationField ? "인증번호 확인" : "인증번호 전송"}
                  </Button>
                </>
              )}

              {/* 비밀번호 재설정 단계 필드들 */}
              {steps === "password" && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>새 비밀번호</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="8자 이상, 영문+숫자+특수문자"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showSecondPassword ? "text" : "password"}
                              placeholder="비밀번호를 다시 입력해주세요"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowSecondPassword(!showSecondPassword)
                              }
                              className="absolute right-3 top-3"
                            >
                              {showSecondPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    비밀번호 재설정
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
