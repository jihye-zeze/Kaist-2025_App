import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserPlus, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { differenceInDays } from "date-fns";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface PatientStatisticsProps {
  selectedDate: Date;
}

export default function PatientStatistics({ selectedDate }: PatientStatisticsProps) {
  const { t } = useTranslation();

  // 선택된 날짜에 따른 데이터 계산
  const calculatePatientData = (date: Date) => {
    const today = new Date();
    const daysDifference = differenceInDays(today, date);

    // 과거 날짜에 따른 데이터 조정
    if (daysDifference > 0) {
      return {
        newPatients: Math.max(3, 11 - Math.floor(daysDifference / 3)),
        returningPatients: Math.max(1, 2 - Math.floor(daysDifference / 5))
      };
    }

    // 오늘 날짜의 기본 데이터
    return {
      newPatients: 11,
      returningPatients: 2
    };
  };

  const patientData = calculatePatientData(selectedDate);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* New Patients Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              신규 환자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <AnimatedNumber
                  value={patientData.newPatients}
                  suffix="명"
                  className="text-3xl font-bold"
                />
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Returning Patients Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              재방문 환자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <AnimatedNumber
                  value={patientData.returningPatients}
                  suffix="명"
                  className="text-3xl font-bold"
                />
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}