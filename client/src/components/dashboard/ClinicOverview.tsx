import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, CalendarCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { MotionCard, ListItem } from "@/components/ui/motion";

// Generate mock data if no real data exists
const generateMockData = (date: Date) => {
  const baseTotal = 50; // Base number of total patients
  const dayOfWeek = date.getDay();

  // More patients on weekdays, less on weekends
  const dayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.2;
  const randomVariation = () => 0.8 + Math.random() * 0.4; // Random variation between 0.8 and 1.2

  const total = Math.round(baseTotal * dayMultiplier * randomVariation());

  return {
    total,
    waiting: Math.round(total * 0.3 * randomVariation()),
    inProgress: Math.round(total * 0.4 * randomVariation()),
    completed: Math.round(total * 0.3 * randomVariation()),
  };
};

export default function ClinicOverview() {
  const { t } = useTranslation();
  const { data: patients } = useQuery({ 
    queryKey: ['/api/patients']
  });

  // Use mock data if no real data exists
  const mockData = generateMockData(new Date());
  const totalPatients = patients?.length || mockData.total;
  const waitingPatients = patients?.filter(p => p.status === 'waiting').length || mockData.waiting;
  const inProgressPatients = patients?.filter(p => p.status === 'in_progress').length || mockData.inProgress;
  const completedPatients = patients?.filter(p => p.status === 'completed').length || mockData.completed;

  return (
    <MotionCard className="overflow-hidden">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-toss-gray">
          <Users className="h-5 w-5" />
          {t('clinicOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-toss-gray-light">{t('totalPatients')}</p>
                <motion.p 
                  className="text-3xl font-bold text-toss-blue mt-1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {totalPatients}<span className="text-lg ml-1">명</span>
                </motion.p>
              </div>
              <motion.div 
                className="h-14 w-14 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-7 w-7 text-toss-blue" />
              </motion.div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <ListItem delay={0.1} className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-toss-gray">
                  {t('waiting')}: <span className="text-yellow-500">{waitingPatients}명</span>
                </span>
              </div>
              <div className="h-2 bg-yellow-50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(waitingPatients / totalPatients) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </ListItem>

            <ListItem delay={0.2} className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-toss-blue" />
                <span className="text-sm font-medium text-toss-gray">
                  {t('inProgress')}: <span className="text-toss-blue">{inProgressPatients}명</span>
                </span>
              </div>
              <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-toss-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(inProgressPatients / totalPatients) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </ListItem>

            <ListItem delay={0.3} className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-toss-gray">
                  {t('completed')}: <span className="text-green-500">{completedPatients}명</span>
                </span>
              </div>
              <div className="h-2 bg-green-50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedPatients / totalPatients) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </ListItem>
          </div>
        </motion.div>
      </CardContent>
    </MotionCard>
  );
}