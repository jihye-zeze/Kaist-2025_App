import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const countries = [
  { value: "kr", label: "대한민국", flag: "🇰🇷" },
  { value: "us", label: "미국", flag: "🇺🇸" },
  { value: "cn", label: "중국", flag: "🇨🇳" },
  { value: "jp", label: "일본", flag: "🇯🇵" },
  { value: "vn", label: "베트남", flag: "🇻🇳" },
  { value: "th", label: "태국", flag: "🇹🇭" },
] as const;

export function CountrySelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-white/90 hover:bg-white/95"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span>{countries.find((country) => country.value === value)?.flag}</span>
              <span>{countries.find((country) => country.value === value)?.label}</span>
            </span>
          ) : (
            "국가 선택"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="국가 검색..." />
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                value={country.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{country.flag}</span>
                  <span>{country.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}