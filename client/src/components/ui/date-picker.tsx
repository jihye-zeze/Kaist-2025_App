import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(date);

  // 날짜 선택 핸들러
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // 현재 날짜와 비교
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate > now) {
      toast({
        title: "날짜 선택 오류",
        description: "미래 날짜는 선택할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setTempDate(selectedDate);
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (tempDate) {
      setDate(tempDate);
      setIsOpen(false);
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            "bg-white/90 hover:bg-white/95 transition-colors",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ko }) : "날짜 선택"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={handleSelect}
            disabled={(date) => {
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              return date > now;
            }}
            initialFocus
            locale={ko}
          />
          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              취소
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}