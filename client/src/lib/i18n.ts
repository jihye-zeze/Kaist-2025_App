import { useEffect, useState } from "react";

const translations = {
  ko: {
    dashboard: "대시보드",
    patients: "환자 관리",
    treatments: "치료 관리",
    finance: "재무 관리",
    appointments: "예약 관리",
    settings: "설정",
    login: "로그인",
    signup: "회원가입",
    forgotPassword: "비밀번호 찾기",
    findId: "아이디 찾기",
    rememberMe: "로그인 상태 유지",
    systemName: "메디트립 시스템",
    loginPrompt: "시스템에 접속하려면 로그인해주세요",
    username: "아이디",
    password: "비밀번호",
    enterUsername: "아이디를 입력하세요",
    enterPassword: "비밀번호를 입력하세요",
    clinicOverview: "환자 현황",
    totalPatients: "전체 환자",
    waiting: "대기 중",
    inProgress: "진료 중",
    completed: "진료 완료",
    foreignPatientStats: "외국인 환자 통계",
    patientNationality: "환자 국적 분포",
    financialOverview: "재무 현황",
    dailyRevenue: "일일 수입",
    cardPayments: "카드 결제",
    cashPayments: "현금 결제",
    revenueByNationality: "국가별 수입",
    treatmentManagement: "치료 관리",
    inventoryAlerts: "재고 알림",
    lowStock: "재고 부족",
    staffOverview: "직원 현황",
    availableStaff: "근무 중인 직원",
    interpreterAvailability: "통역사 현황",
    chatSupport: "AI 의료 상담",
    chatError: "죄송합니다. 메시지 전송 중 오류가 발생했습니다.",
    typeMessage: "메시지를 입력하세요...",
  },
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    treatments: "Treatments",
    finance: "Finance",
    appointments: "Appointments",
    settings: "Settings",
    login: "Login",
    signup: "Sign Up",
    forgotPassword: "Forgot Password",
    findId: "Find ID",
    rememberMe: "Remember Me",
    systemName: "Meditrip System",
    loginPrompt: "Please login to access the system",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    clinicOverview: "Clinic Overview",
    totalPatients: "Total Patients",
    waiting: "Waiting",
    inProgress: "In Progress",
    completed: "Completed",
    foreignPatientStats: "Foreign Patient Stats",
    patientNationality: "Patient Nationality",
    preferredLanguages: "Preferred Languages",
    financialOverview: "Financial Overview",
    dailyRevenue: "Daily Revenue",
    cardPayments: "Card Payments",
    cashPayments: "Cash Payments",
    revenueByTreatment: "Revenue by Treatment",
    treatmentManagement: "Treatment Management",
    inventoryAlerts: "Inventory Alerts",
    lowStock: "Low Stock",
    staffOverview: "Staff Overview",
    availableStaff: "Available Staff",
    interpreterAvailability: "Interpreter Availability",
    chatSupport: "AI Medical Consultation",
    chatError: "Sorry, an error occurred while sending your message.",
    typeMessage: "Type your message...",
  },
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations[Language];

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("ko");

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return {
    t,
    i18n: {
      language,
      changeLanguage: setLanguage,
    },
  };
}