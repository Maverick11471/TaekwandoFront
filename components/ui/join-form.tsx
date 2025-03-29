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
import { mailCheck } from "../../app/apis/memberApis";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function InputForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailFieldDisabled, setIsEmailFieldDisabled] = useState(false);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false); // 인증번호 유효성 상태
  const [isVerificationComplete, setIsVerificationComplete] = useState(false); // 인증 완료 상태
  const [showVerificationField, setShowVerificationField] = useState(false); // 인증번호 필드 표시 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기/숨기기 상태
  const [showSecondPassword, setShowSecondPassword] = useState(false); // 비밀번호 보기/숨기기 상태
  const dispatch = useAppDispatch();
  const emailState = useAppSelector((state) => state.member.email);

  const FormSchema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),

    emailVerificationCode: z.string().superRefine((value, ctx) => {
      if (!isEmailFieldDisabled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // 커스텀 오류 코드
          message: "인증번호 전송 버튼을 먼저 눌러주세요.", // 오류 메시지
        });
      } else if (value.length != 6) {
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
  });

  useEffect(() => {
    // isEmailFieldDisabled 상태가 변경될 때마다 유효성 검사 트리거
    form.trigger("emailVerificationCode");
  }, [isEmailFieldDisabled, form]);

  // 토글 핸들러 추가
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowSecondPassword = () => {
    setShowSecondPassword((prev) => !prev);
  };

  // 이메일 유효성 검사
  const emailValue = form.watch("email");

  useEffect(() => {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(emailValue);
    setIsEmailValid(result.success); // 이메일 유효성 상태 업데이트
  }, [emailValue]);

  // 인증번호 유효성 검사
  const verificationCodeValue = form.watch("emailVerificationCode");

  useEffect(() => {
    const verificationCodeSchema = z
      .string()
      .length(6, { message: "6자리 숫자를 입력해주세요" })
      .regex(/^\d+$/, { message: "인증번호는 숫자로만 입력해주세요" });
    const result = verificationCodeSchema.safeParse(verificationCodeValue);
    setIsVerificationCodeValid(result.success); // 인증번호 유효성 상태 업데이트
  }, [verificationCodeValue]);

  const handleVerifyCode = () => {
    setIsVerificationComplete(true); // 인증 완료 상태로 변경
    toast.success("인증이 완료되었습니다.");
  };

  const handleSendVerificationCode = () => {
    toast.success("인증번호가 전송되었습니다.");
    setIsEmailFieldDisabled(true);
    setShowVerificationField(true); // 인증번호 필드 표시
  };

  function onSubmit() {
    setIsDialogOpen(true);
  }
  const router = useRouter();

  const handleValidation = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsDialogOpen(true);
    } else {
      form.trigger();
      toast.error("필수 입력 항목을 확인해주세요");
    }
  };

  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const handleEmailDuplicateCheck = async () => {
    const email = form.getValues("email");

    try {
      const response = await dispatch(mailCheck({ email })).unwrap();

      if (response.memberEmailCheckMsg === "available email") {
        toast.success("사용 가능한 이메일입니다.");
        handleSendVerificationCode();
      } else if (response.memberEmailCheckMsg === "invalid email") {
        toast.error("이미 사용중인 이메일입니다.");
      }
    } catch (error) {
      console.log(error);
      toast.error("서버 검증에 실패했습니다.");
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
                  <AccordionContent>
                    회원가입은 부모님께서 도와주시길 권장드립니다. 이유는 아이가
                    미션을 성공 후 부모님 서명 (2차 비밀번호)를 받아야 관장님께
                    전달되는 시스템으로 설계되었습니다. <br />
                    최종 포인트 적립은 관장님 승인 후 적립됩니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Form {...form}>
            <form
              id="joinForm"
              onSubmit={form.handleSubmit(onSubmit)}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                disabled={isEmailFieldDisabled}
              />

              {isEmailValid && !isEmailFieldDisabled && (
                <div>
                  <Button
                    type="button"
                    onClick={handleEmailDuplicateCheck}
                    className="w-full"
                    disabled={!isEmailValid || isEmailAvailable}
                  >
                    {isEmailAvailable
                      ? "인증번호 전송 완료"
                      : "이메일 중복 확인"}
                  </Button>
                  {/* 인증번호 전송 버튼 밑에 오류 메시지 표시 */}
                  {form.formState.errors.emailVerificationCode && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.emailVerificationCode.message}
                    </p>
                  )}
                </div>
              )}

              {/* 이메일 인증번호 필드 */}
              {showVerificationField && (
                <>
                  {/* 이메일 인증번호 필드 */}
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
                            disabled={isVerificationComplete} // 인증 완료 시 비활성화
                          />
                        </FormControl>
                        <FormMessage />
                        {isVerificationComplete && (
                          <p className="text-green-500 text-sm">
                            인증 완료되었습니다.
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* 인증번호 검증 버튼 */}
                  {isVerificationCodeValid && !isVerificationComplete && (
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      className="w-full"
                    >
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
                          type={showPassword ? "text" : "password"} // 동적 타입 변경
                        />
                      </FormControl>
                      <button
                        type="button" // 버튼 타입을 명시적으로 지정
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
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
                          type={showPassword ? "text" : "password"} // 동적 타입 변경
                        />
                      </FormControl>
                      <button
                        type="button" // 버튼 타입을 명시적으로 지정
                        onClick={toggleShowSecondPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showSecondPassword ? (
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

              <AlertDialog open={isDialogOpen}>
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
                    <AlertDialogCancel onClick={() => router.push("/")}>
                      아니오
                    </AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      onClick={form.handleSubmit((formData) => {
                        toast(
                          `관장님께 회원가입 요청이 전송되었습니다. 승인 후 사용 가능합니다.`,
                          {
                            description: `Username: ${formData.username}`,
                          }
                        );
                        router.push("/");
                      })}
                    >
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
