import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { MotionCard } from "@/components/ui/motion";

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
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function InsuranceDocuments() {
  return (
    <MotionCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          보험서류 발급
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* 국민건강보험 가입 외국인 환자 섹션 */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-2 text-toss-blue">
              <Check className="h-5 w-5" />
              <h3 className="font-medium">국민건강보험 가입 외국인 환자</h3>
            </div>
            <div className="space-y-2 pl-7">
              <motion.p 
                variants={item} 
                className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg flex gap-2 items-start"
              >
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                의료기관이 재택진료를 실시한 경우, 총 진료비 중 건강보험공단에 사후 청구됩니다.
              </motion.p>
              <motion.p 
                variants={item}
                className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg flex gap-2 items-start"
              >
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                외국인의 주민등록번호로 보험자격정보가 확인되면, 내국인과 동일하게 진료받을 수 있습니다.
              </motion.p>
            </div>
          </motion.div>

          {/* 국민건강보험 미가입 외국인 환자 섹션 */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">국민건강보험 미가입 외국인 환자</h3>
            </div>
            <div className="space-y-2 pl-7">
              <motion.p 
                variants={item}
                className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg flex gap-2 items-start"
              >
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                의료기관의 자율에 따라 의료서비스 비용이 청구됩니다.
              </motion.p>
              <motion.p 
                variants={item}
                className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg flex gap-2 items-start"
              >
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                이 비용을 <span className="font-semibold">외국인수가</span>라고 하며, 외국인 환자 유치에 소요되는 비용이 포함됩니다.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </MotionCard>
  );
}
