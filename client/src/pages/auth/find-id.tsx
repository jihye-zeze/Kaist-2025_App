import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useTranslation } from "@/lib/i18n";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { HerbalMedicinePotIcon } from "@/components/ui/icons";

const findIdSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
});

type FindIdForm = z.infer<typeof findIdSchema>;

export default function FindIdPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<FindIdForm>({
    resolver: zodResolver(findIdSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: FindIdForm) => {
    try {
      const response = await fetch('/api/auth/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '아이디 찾기에 실패했습니다');
      }

      toast({
        title: "아이디 찾기 성공",
        description: "등록된 이메일로 아이디가 전송되었습니다",
      });
    } catch (error) {
      toast({
        title: "아이디 찾기 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center mb-4"
            >
              <HerbalMedicinePotIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t("systemName")}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              아이디 찾기
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="가입시 등록한 이메일을 입력하세요"
                {...form.register("email")}
                className="bg-white/50 backdrop-blur-sm"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="가입시 등록한 이름을 입력하세요"
                {...form.register("name")}
                className="bg-white/50 backdrop-blur-sm"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "아이디 찾기"
              )}
            </Button>

            <div className="mt-4 text-center space-y-2">
              <Link href="/auth">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:text-blue-700"
                >
                  로그인 페이지로 돌아가기
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}