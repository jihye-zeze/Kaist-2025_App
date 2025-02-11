import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Download, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { Patient, Reservation } from "@shared/schema";
import { generateMockReservations } from "@/lib/mock-data";
import { format } from "date-fns";
import classNames from "classnames";

const countryFlags: Record<string, string> = {
  KR: "🇰🇷",
  US: "🇺🇸",
  CN: "🇨🇳",
  JP: "🇯🇵",
};

const TableHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={classNames(
      "px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [insuranceFilter, setInsuranceFilter] = useState<string>("all");
  const [nationalityFilter, setNationalityFilter] = useState<string>("all");
  const [treatmentFilter, setTreatmentFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [date, setDate] = useState<Date>(new Date());

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["/api/reservations", date.toISOString()],
    queryFn: () => generateMockReservations(date),
  });

  const filteredReservations = reservations?.filter((reservation) => {
    const matchesSearch =
      searchTerm === "" ||
      reservation.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.patient.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.treatmentCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;

    const matchesNationality =
      nationalityFilter === "all" || reservation.patient.nationality === nationalityFilter;

    const matchesTreatment =
      treatmentFilter === "all" || reservation.treatmentCategory === treatmentFilter;

    const matchesInsurance =
      insuranceFilter === "all" ||
      (insuranceFilter === "yes" && reservation.insuranceApplied) ||
      (insuranceFilter === "no" && !reservation.insuranceApplied);

    const matchesPaymentStatus =
      paymentStatusFilter === "all" || reservation.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus && matchesNationality && matchesTreatment && matchesInsurance && matchesPaymentStatus;
  });

  const handleExport = () => {
    // TODO: Implement CSV export
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const uniqueNationalities = Array.from(new Set(reservations?.map(r => r.patient.nationality) || []));
  const uniqueTreatments = Array.from(new Set(reservations?.map(r => r.treatmentCategory) || []));

  return (
    <div className="flex h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">예약 관리</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    placeholder="이름, 국적, 진료과목으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                </div>
                <DatePicker
                  date={date}
                  setDate={setDate}
                />
                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  내보내기 (.CSV)
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <TableHeader>예약 번호</TableHeader>
                    <TableHeader>환자 이름</TableHeader>
                    <TableHeader className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span>국적</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => setNationalityFilter("all")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              nationalityFilter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            전체
                          </button>
                          {uniqueNationalities.map((nationality) => (
                            <button
                              key={nationality}
                              onClick={() => setNationalityFilter(nationality)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                nationalityFilter === nationality ? "bg-blue-50 text-blue-700" : "text-gray-700"
                              } hover:bg-blue-50 transition-colors duration-150`}
                            >
                              {countryFlags[nationality]} {nationality}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TableHeader>
                    <TableHeader className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span>진료 과목</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => setTreatmentFilter("all")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              treatmentFilter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            전체
                          </button>
                          {uniqueTreatments.map((treatment) => (
                            <button
                              key={treatment}
                              onClick={() => setTreatmentFilter(treatment)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                treatmentFilter === treatment ? "bg-blue-50 text-blue-700" : "text-gray-700"
                              } hover:bg-blue-50 transition-colors duration-150`}
                            >
                              {treatment}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TableHeader>
                    <TableHeader className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span>상태</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => setStatusFilter("all")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              statusFilter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            전체
                          </button>
                          <button
                            onClick={() => setStatusFilter("reserved")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              statusFilter === "reserved" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            예약
                          </button>
                          <button
                            onClick={() => setStatusFilter("cancelled")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              statusFilter === "cancelled" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            취소
                          </button>
                          <button
                            onClick={() => setStatusFilter("no_show")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              statusFilter === "no_show" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            No Show
                          </button>
                        </div>
                      </div>
                    </TableHeader>
                    <TableHeader className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span>보험 적용</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => setInsuranceFilter("all")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              insuranceFilter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            전체
                          </button>
                          <button
                            onClick={() => setInsuranceFilter("yes")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              insuranceFilter === "yes" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            적용
                          </button>
                          <button
                            onClick={() => setInsuranceFilter("no")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              insuranceFilter === "no" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            미적용
                          </button>
                        </div>
                      </div>
                    </TableHeader>
                    <TableHeader className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span>결제 상태</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => setPaymentStatusFilter("all")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              paymentStatusFilter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            전체
                          </button>
                          <button
                            onClick={() => setPaymentStatusFilter("paid")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              paymentStatusFilter === "paid" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            결제 완료
                          </button>
                          <button
                            onClick={() => setPaymentStatusFilter("unpaid")}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              paymentStatusFilter === "unpaid" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-150`}
                          >
                            미결제
                          </button>
                        </div>
                      </div>
                    </TableHeader>
                    <TableHeader>예약일</TableHeader>
                    <TableHeader>예약 시간</TableHeader>
                    <TableHeader className="text-right">작업</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredReservations?.map((reservation) => (
                      <motion.tr
                        key={reservation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.reservationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.patient.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center space-x-1">
                            <span>{countryFlags[reservation.patient.nationality]}</span>
                            <span>{reservation.patient.nationality}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.treatmentCategory}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reservation.status === "reserved"
                                ? "bg-green-100 text-green-800"
                                : reservation.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {reservation.status === "reserved"
                              ? "예약"
                              : reservation.status === "cancelled"
                              ? "취소"
                              : "No Show"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.insuranceApplied ? "적용" : "미적용"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reservation.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {reservation.paymentStatus === "paid" ? "결제 완료" : "미결제"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(reservation.createdAt), 'yyyy-MM-dd')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(reservation.createdAt), 'HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-150"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors duration-150 ml-2"
                          >
                            삭제
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}