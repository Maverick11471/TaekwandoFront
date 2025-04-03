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
import { useAppDispatch } from "@/lib/hooks";
import { findPassword, emailVericationCodeCheck } from "@/app/apis/memberApis";

export default function InputForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [steps, setSteps] = useState<"auth" | "password">("auth");
  const [states, setStates] = useState({
    isEmailValid: false,
    isUsernameValid: false,
    isEmailFieldDisabled: false,
    isVerificationComplete: false,
    isLoading: false,
    showVerificationField: false,
  });
  const isVerificationCompleteRef = useRef(states.isVerificationComplete);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const FormSchema = z
    .object({
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
    defaultValues: {
      email: "",
      username: "",
      emailVerificationCode: "",
      password: "",
      secondPassword: "",
    },
  });

  const emailValue = form.watch("email");
  const usernameValue = form.watch("username");

  useEffect(() => {
    const emailSchema = z.string().email();
    const usernameSchema = z.string().min(2).max(20);

    setStates((prev) => ({
      ...prev,
      isEmailValid: emailSchema.safeParse(emailValue).success,
      isUsernameValid: usernameSchema.safeParse(usernameValue).success,
    }));
  }, [emailValue, usernameValue]);

  const handleSendVerificationCode = async () => {
    setStates((prev) => ({ ...prev, isLoading: true }));

    const payload = form.getValues();
    try {
      const result = await dispatch(findPassword(payload));

      if (result.meta.requestStatus === "fulfilled") {
        setStates((prev) => ({
          ...prev,
          isEmailFieldDisabled: true,
          showVerificationField: true,
          isNotVerificationEmail: true,
          isEmailValid: true,
          verificationCode: result.payload.verificationCode,
        }));
        toast.success("인증번호가 전송되었습니다.");
      } else {
        const errorData = result.payload;

        switch (errorData.errorMessage) {
          case "email not found":
            toast.error("존재하지 않는 이메일입니다");
            break;
          case "The name associated with the email does not match":
            toast.error("이메일과 이름이 일치하지 않습니다.");
            break;
          default:
            toast.error("로그인 실패: 알 수 없는 오류");
        }

        console.log(result);
      }
    } catch (error) {
      toast.error("서버 연결에 실패했습니다");
    } finally {
      setStates((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleVerifyCode = async () => {
    const email = form.getValues("email");
    const enteredCode = form.getValues("emailVerificationCode");
    const emailVericationCodeCheckResult = await dispatch(
      emailVericationCodeCheck({ enteredCode, email })
    ).unwrap();
    console.log(emailVericationCodeCheck);
    if (emailVericationCodeCheckResult) {
      setStates((prev) => ({ ...prev, isVerificationComplete: true }));
      toast.success("인증이 완료되었습니다.");
      router.push("/changePassword");
    } else {
      form.setError("emailVerificationCode", {
        message: "잘못된 인증번호입니다",
      });
    }
  };
  return (
    <div
      className={cn("flex flex-col gap-6 mb-16 mt-10", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 찾기</CardTitle>
          <CardDescription>
            {steps === "password"
              ? "새로운 비밀번호를 입력해주세요"
              : "이메일과 이름을 입력해주세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSendVerificationCode)}
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
                            disabled={states.isEmailFieldDisabled}
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
                            disabled={states.isEmailFieldDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {states.isEmailValid && states.isUsernameValid && (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={states.isLoading || states.isEmailFieldDisabled} // ✅ 비활성화 조건 추가
                    >
                      {states.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          처리 중...
                        </div>
                      ) : (
                        "인증번호 전송"
                      )}
                    </Button>
                  )}

                  {states.showVerificationField && (
                    <>
                      <FormField
                        control={form.control}
                        name="emailVerificationCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이메일 인증번호</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="123456"
                                disabled={states.isVerificationComplete}
                                onChange={(e) => {
                                  const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!states.isVerificationComplete && (
                        <Button type="button" onClick={handleVerifyCode}>
                          인증번호 검증
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
