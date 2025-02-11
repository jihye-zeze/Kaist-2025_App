import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelect } from "@/components/ui/country-select";
import { useState } from "react";
import { Book } from "lucide-react";

const regulations = {
  kr: [
    "의료기관 개설 허가 필수",
    "외국인 환자 유치 등록제도 준수",
    "의료광고 사전심의 필수",
  ],
  us: [
    "HIPAA 규정 준수 필수",
    "의료면허 상호인정 협약 필요",
    "원격진료 관련 규제 적용",
  ],
  cn: [
    "중의학 자격증 인증 필요",
    "의료기기 수입 허가 필수",
    "진료기록 중국어 번역 필수",
  ],
  jp: [
    "의료통역사 상주 필수",
    "의료사고 보험 가입 필수",
    "치료동의서 일본어 제공 필수",
  ],
};

export default function RegulationsCard() {
  const [country, setCountry] = useState("kr");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          국가별 의료 규제
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CountrySelect value={country} onValueChange={setCountry} />
          
          <ul className="space-y-2">
            {regulations[country as keyof typeof regulations].map((regulation, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {regulation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
