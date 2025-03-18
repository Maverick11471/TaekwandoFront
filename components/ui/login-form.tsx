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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    이메일 / 비밀번호 찾기
                  </a>
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
              <a href="#" className="underline underline-offset-4">
                회원가입
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
