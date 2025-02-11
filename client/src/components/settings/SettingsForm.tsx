import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

// Enhanced validation schema for clinic settings including photo
const clinicSettingsSchema = z.object({
  clinicName: z.string().min(1, "병원명을 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  website: z.string().url("올바른 웹사이트 주소를 입력해주세요").optional(),
  businessRegistration: z.string().min(1, "사업자등록번호를 입력해주세요"),
  operatingHours: z.object({
    weekday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    weekend: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
  languages: z.array(z.string()).min(1, "지원 언어를 선택해주세요"),
});

type ClinicSettings = z.infer<typeof clinicSettingsSchema>;

const availableLanguages = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function SettingsForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ClinicSettings>({
    resolver: zodResolver(clinicSettingsSchema),
    defaultValues: {
      clinicName: "",
      address: "",
      phone: "",
      website: "",
      businessRegistration: "",
      operatingHours: {
        weekday: { start: "09:00", end: "18:00" },
        weekend: { start: "09:00", end: "13:00" },
      },
      languages: ["ko"],
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "이미지 형식 오류",
        description: "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "파일 크기 초과",
        description: "이미지 크기는 5MB를 초과할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ClinicSettings) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save settings
      console.log("Saving settings:", data);
      toast({
        title: "설정이 저장되었습니다",
        description: "클리닉 정보가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "설정 저장 실패",
        description: "설정을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hospital Photo Upload */}
        <div className="space-y-4">
          <FormLabel>병원 사진</FormLabel>
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              id="hospital-photo"
            />
            <label
              htmlFor="hospital-photo"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {photoPreview ? (
                <div className="relative group">
                  <img
                    src={photoPreview}
                    alt="Hospital preview"
                    className="max-w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    클릭하여 병원 사진 업로드
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, WebP / 최대 5MB
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        <FormField
          control={form.control}
          name="clinicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>병원명</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>웹사이트</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50" placeholder="https://" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessRegistration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사업자등록번호</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">운영 시간</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>평일</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="operatingHours.weekday.start"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="time" {...field} className="bg-white/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="self-center">~</span>
                <FormField
                  control={form.control}
                  name="operatingHours.weekday.end"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="time" {...field} className="bg-white/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>주말</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="operatingHours.weekend.start"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="time" {...field} className="bg-white/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="self-center">~</span>
                <FormField
                  control={form.control}
                  name="operatingHours.weekend.end"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="time" {...field} className="bg-white/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>지원 언어</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {availableLanguages.map((language) => (
              <FormField
                key={language.value}
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(language.value)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), language.value]
                            : field.value?.filter((val) => val !== language.value) || [];
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">{language.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "설정 저장"
          )}
        </Button>
      </form>
    </Form>
  );
}