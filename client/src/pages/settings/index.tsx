import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/lib/i18n";
import { SettingsForm } from "@/components/settings/SettingsForm";
import {
  Building2,
  Users,
  Stethoscope,
  Calendar,
  Wallet,
  ScrollText,
  Bell,
  Globe,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const container = {
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const settingsSections = [
  {
    id: "general",
    icon: Building2,
    title: "일반 설정",
    description: "병원 기본 정보 및 운영 설정",
    fields: ["병원명", "운영 시간", "주소", "연락처"]
  },
  {
    id: "users",
    icon: Users,
    title: "사용자 관리",
    description: "직원 계정 및 권한 관리",
    fields: ["계정 관리", "권한 설정", "접근 제어", "보안 정책"]
  },
  {
    id: "medical",
    icon: Stethoscope,
    title: "진료 및 치료 설정",
    description: "치료 카테고리 및 가격 설정",
    fields: ["치료 항목", "가격표", "보험 적용", "의료 기록"]
  },
  {
    id: "appointments",
    icon: Calendar,
    title: "예약 및 환자 관리",
    description: "예약 규칙 및 환자 기록 설정",
    fields: ["예약 정책", "대기 시간", "알림 설정", "환자 양식"]
  },
  {
    id: "financial",
    icon: Wallet,
    title: "재무 및 결제 설정",
    description: "결제 수단 및 청구서 설정",
    fields: ["결제 방식", "통화 설정", "세금 정책", "영수증 양식"]
  },
  {
    id: "compliance",
    icon: ScrollText,
    title: "법적 규제 및 인증",
    description: "규정 준수 및 인증 설정",
    fields: ["의료 관광", "개인정보 보호", "인증서 관리", "규정 준수"]
  },
  {
    id: "notifications",
    icon: Bell,
    title: "알림 및 커뮤니케이션",
    description: "알림 및 메시지 설정",
    fields: ["SMS 설정", "이메일 설정", "앱 알림", "자동 알림"]
  },
  {
    id: "language",
    icon: Globe,
    title: "다국어 지원",
    description: "언어 및 지역화 설정",
    fields: ["언어 설정", "번역 관리", "지역 설정", "시간대 설정"]
  }
];

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState("general");
  const { t } = useTranslation();

  const renderSettingsContent = () => {
    switch (selectedSection) {
      case "general":
        return <SettingsForm />;
      default:
        return (
          <div className="space-y-6">
            {settingsSections
              .find(s => s.id === selectedSection)
              ?.fields.map((field, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-900">{field}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    설정 컨트롤이 추가될 예정입니다.
                  </p>
                </div>
              ))}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="h-full max-w-7xl mx-auto space-y-8"
        >
          <motion.div variants={item}>
            <h1 className="text-3xl font-bold text-gray-900">설정</h1>
            <p className="mt-2 text-gray-600">
              시스템 설정을 관리하고 기본 설정을 구성하세요
            </p>
          </motion.div>

          <div className="h-[calc(100vh-12rem)] grid grid-cols-12 gap-6">
            {/* Settings Navigation */}
            <motion.div variants={item} className="col-span-4 space-y-4">
              <ScrollArea className="h-full">
                {settingsSections.map((section) => (
                  <Card
                    key={section.id}
                    className={cn(
                      "mb-4 cursor-pointer transition-all duration-200",
                      "backdrop-blur-sm hover:shadow-lg",
                      selectedSection === section.id
                        ? "bg-white shadow-md border-blue-200"
                        : "bg-white/80 hover:bg-white"
                    )}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          selectedSection === section.id
                            ? "bg-blue-50"
                            : "bg-gray-50"
                        )}>
                          <section.icon className={cn(
                            "h-5 w-5",
                            selectedSection === section.id
                              ? "text-blue-500"
                              : "text-gray-500"
                          )} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium">
                            {section.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {section.description}
                          </p>
                        </div>
                        <ChevronRight className={cn(
                          "h-5 w-5 transition-transform",
                          selectedSection === section.id
                            ? "text-blue-500 rotate-90"
                            : "text-gray-300"
                        )} />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </ScrollArea>
            </motion.div>

            {/* Settings Content */}
            <motion.div variants={item} className="col-span-8">
              <Card className="h-full backdrop-blur-sm bg-white/80">
                <CardHeader className="p-6 border-b">
                  <CardTitle>
                    {settingsSections.find(s => s.id === selectedSection)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-20rem)]">
                    {renderSettingsContent()}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}