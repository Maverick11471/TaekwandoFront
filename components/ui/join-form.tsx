"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  mailCheck,
  sendEmail,
  emailVericationCodeCheck,
  join,
} from "../../app/apis/memberApis";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function InputForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [states, setStates] = useState({
    isDialogOpen: false,
    isEmailValid: false,
    isEmailFieldDisabled: false,
    isVerificationComplete: false,
    showVerificationField: false,
    showPassword: false,
    showSecondPassword: false,
    isNotVerificationEmail: null as boolean | null,
    isSending: false,
    verificationCode: "",
  });

  const FormSchema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
    emailVerificationCode: z.string().superRefine(function (
      this: { context: { isSendMail?: boolean } },
      value,
      ctx
    ) {
      const context = this.context;
      if (context?.isSendMail === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "이메일 인증을 먼저 완료해주세요.",
        });
      } else if (value.length !== 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "인증번호는 6자리 숫자입니다.",
        });
      } else if (!/^\d+$/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "인증번호는 숫자로만 입력해주세요.",
        });
      }
    }),
    username: z
      .string()
      .min(2, { message: "사용자 이름은 2자 이상이어야 합니다" })
      .max(20),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다" })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[\W_]).{8,}$/, {
        message: "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다",
      }),
    secondPassword: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다" })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[\W_]).{8,}$/, {
        message: "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다",
      }),
    birthday: z
      .date({
        required_error: "생년월일을 입력해 주세요.",
      })
      .refine((date) => date <= new Date(), {
        message: "생년월일은 현재 날짜보다 이전이어야 합니다",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      emailVerificationCode: "",
      username: "",
      password: "",
      secondPassword: "",
      birthday: undefined,
    },
    context: {
      isSendMail: states.showVerificationField,
    },
  });

  const emailValue = form.watch("email");

  useEffect(() => {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(emailValue);
    setStates((prev) => ({ ...prev, isEmailValid: result.success }));
  }, [emailValue]);

  const handleEmailVerification = async () => {
    setStates((prev) => ({ ...prev, isSending: true }));

    try {
      const email = form.getValues("email");

      // 이메일 중복 검사
      const checkRes = await dispatch(mailCheck({ email })).unwrap();
      if (checkRes.memberEmailCheckMsg === "invalid email") {
        setStates((prev) => ({ ...prev, isNotVerificationEmail: false }));
        toast.error("이미 사용중인 이메일입니다.");
        return;
      }

      // 인증번호 전송
      const sendRes = await dispatch(sendEmail({ email })).unwrap();
      if (sendRes.sendEmailMsg === "SendEmail Success") {
        setStates((prev) => ({
          ...prev,
          isEmailFieldDisabled: true,
          showVerificationField: true,
          isNotVerificationEmail: true,
          verificationCode: sendRes.verificationCode,
        }));
        toast.success("인증번호가 전송되었습니다.");
      }
    } catch (error) {
      toast.error("서버 처리 중 오류 발생");
    } finally {
      setStates((prev) => ({ ...prev, isSending: false }));
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
    } else {
      toast.error("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!states.isVerificationComplete) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }
    setStates((prev) => ({ ...prev, isDialogOpen: true }));
  };

  // 토글 핸들러 추가
  const toggleShowPassword = () => {
    setStates((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const toggleShowSecondPassword = () => {
    setStates((prev) => ({
      ...prev,
      showSecondPassword: !prev.showSecondPassword,
    }));
  };

  const handleSendVerificationCode = () => {
    setStates((prev) => ({ ...prev, isEmailFieldDisabled: true }));
    setStates((prev) => ({ ...prev, showVerificationField: true }));
  };

  function onSubmit() {
    setStates((prev) => ({ ...prev, isDialogOpen: true }));
  }

  const handleValidation = async () => {
    const isValid = await form.trigger();

    if (!states.isVerificationComplete) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }

    if (isValid) {
      setStates((prev) => ({ ...prev, isDialogOpen: true }));
    } else {
      toast.error("필수 입력 항목을 확인해주세요");
    }
  };

  const handleConfirm = async () => {
    try {
      const { emailVerificationCode, ...values } = form.getValues();
      const payload = {
        ...values,
        birthday: values.birthday.toISOString().split("T")[0], // YYYY-MM-DD 형식
      };

      const result = await dispatch(join(payload)).unwrap();

      toast.success("회원가입 요청이 전송되었습니다");
      router.push("/");
    } catch (error) {
      toast.error("가입 처리 중 오류 발생");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 mb-16 mt-10", className)}
      {...props}
    >
      <Card>
        <CardContent>
          {/* 아코디언 */}
          <Card className="min-h-0 mb-7 p-1 pb-0">
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full mb-10"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>[필독] 회원가입 설명</AccordionTrigger>
                  <AccordionContent className="pb-0">
                    회원가입은 부모님께서 도와주시길 권장드립니다. 이유는 아이가
                    미션을 성공 후 부모님 서명 (2차 비밀번호)를 받아야 관장님께
                    전달되는 시스템으로 설계되었습니다. <br />
                    최종 포인트 적립은 관장님 회원가입 승인 후 가능합니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-5"
            >
              {/* 이메일 필드 */}
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
                    {states.isNotVerificationEmail !== null && (
                      <p
                        className={
                          states.isNotVerificationEmail
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {states.isNotVerificationEmail
                          ? "사용 가능한 이메일입니다."
                          : "이미 사용중인 이메일입니다."}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {states.isEmailValid && !states.isEmailFieldDisabled && (
                <Button
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={states.isSending}
                >
                  {states.isSending ? (
                    <div className="flex items-center gap-2">
                      <Spinner /> 처리 중...
                    </div>
                  ) : (
                    "이메일 인증하기"
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

              {/* 비밀번호 필드 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                          type={states.showPassword ? "text" : "password"} // 동적 타입 변경
                        />
                      </FormControl>
                      <button
                        type="button" // 버튼 타입을 명시적으로 지정
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {states.showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 사용자 이름 필드 */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용자 이름 (아이)</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* {생년월일} */}
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => {
                  const currentDate = field.value || new Date();
                  const currentYear = currentDate.getFullYear();
                  const currentMonth = currentDate.getMonth() + 1;
                  const currentDay = currentDate.getDate();
                  const daysInMonth = new Date(
                    currentYear,
                    currentMonth,
                    0
                  ).getDate();

                  const handleDateChange = (
                    type: "year" | "month" | "day",
                    value: string
                  ) => {
                    const newDate = new Date(currentDate);
                    switch (type) {
                      case "year":
                        newDate.setFullYear(parseInt(value));
                        break;
                      case "month":
                        newDate.setMonth(parseInt(value) - 1);
                        break;
                      case "day":
                        newDate.setDate(parseInt(value));
                        break;
                    }
                    newDate.setHours(0, 0, 0, 0); // 시간 정보 초기화
                    field.onChange(newDate);
                  };

                  return (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>생년월일</FormLabel>
                      <div className="flex gap-2 w-full">
                        <FormControl className="flex-1">
                          <select
                            value={currentYear}
                            onChange={(e) =>
                              handleDateChange("year", e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            {Array.from(
                              { length: new Date().getFullYear() - 1899 },
                              (_, i) => 1900 + i
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}년
                              </option>
                            ))}
                          </select>
                        </FormControl>

                        <FormControl className="flex-1">
                          <select
                            value={currentMonth}
                            onChange={(e) =>
                              handleDateChange("month", e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <option key={month} value={month}>
                                  {month.toString().padStart(2, "0")}월
                                </option>
                              )
                            )}
                          </select>
                        </FormControl>

                        <FormControl className="flex-1">
                          <select
                            value={currentDay}
                            onChange={(e) =>
                              handleDateChange("day", e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            {Array.from(
                              { length: daysInMonth },
                              (_, i) => i + 1
                            ).map((day) => (
                              <option key={day} value={day}>
                                {day.toString().padStart(2, "0")}일
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  부모님 승인용
                </span>
              </div>

              {/* 2차 비밀번호 필드 */}
              <FormField
                control={form.control}
                name="secondPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2차 비밀번호</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                          type={states.showSecondPassword ? "text" : "password"} // 동적 타입 변경
                        />
                      </FormControl>
                      <button
                        type="button" // 버튼 타입을 명시적으로 지정
                        onClick={toggleShowSecondPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {states.showSecondPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialog open={states.isDialogOpen}>
                <AlertDialogTrigger
                  className="bg-black h-10"
                  style={{
                    borderRadius: "calc(var(--radius) - 2px)",
                    color: "white",
                  }}
                  onClick={handleValidation}
                >
                  인증요청
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      현재 경희대 최강 태권도(의정부점)를 다니고 있나요?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      이 페이지는 경희대 최강 태권도(의정부점)를 다니는 원생만
                      사용 가능합니다. <br /> 또한 관장님의 승인 후 아이디를
                      사용할 수 있습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      type="button"
                      onClick={() =>
                        setStates((prev) => ({ ...prev, isDialogOpen: false }))
                      }
                    >
                      아니오
                    </AlertDialogCancel>
                    <AlertDialogAction type="button" onClick={handleConfirm}>
                      네!
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
