"use client";
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
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { login } from "../../app/apis/memberApis";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod 유효성 검사 스키마
const FormSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [states, setStates] = useState({
    showPassword: false,
    isLoading: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleShowPassword = () => {
    setStates((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const onSubmit = async () => {
    setStates((prev) => ({ ...prev, isLoading: true }));
    const payload = form.getValues();

    try {
      const result = await dispatch(login(payload));

      if (result.meta.requestStatus === "fulfilled") {
        router.push("/");
      } else {
        const errorData = result.payload;

        switch (errorData.errorMessage) {
          case "email not found":
            toast.error("존재하지 않는 이메일입니다");
            break;
          case "wrong password":
            toast.error("비밀번호가 일치하지 않습니다");
            break;
          default:
            toast.error("로그인 실패: 알 수 없는 오류");
        }
      }
    } catch (error) {
      toast.error("서버 연결에 실패했습니다");
    } finally {
      setStates((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>이메일과 를 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex w-full items-center justify-between">
                      <FormLabel>비밀번호</FormLabel>
                      <Link
                        href="/findProfile"
                        className="underline underline-offset-4 font-medium text-sm"
                      >
                        비밀번호 찾기
                      </Link>
                    </div>
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

              <Button
                type="submit"
                className="w-full"
                disabled={states.isLoading}
              >
                {states.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    처리 중...
                  </div>
                ) : (
                  "로그인"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              회원가입을 아직 안하셨나요?{" "}
              <Link href="/join" className="underline underline-offset-4">
                회원가입
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
