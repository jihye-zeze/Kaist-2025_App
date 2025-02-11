import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useTranslation } from "@/lib/i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { subDays, format, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { Users, TrendingUp } from "lucide-react";

interface PatientVisit {
  visitDate: string;
  patientId: string;
  nationality: string;
}

// Enhanced mock data generation
const generateMockData = () => {
  const nationalities = ["한국", "중국", "일본", "미국", "베트남"];
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const visits = Math.floor(Math.random() * 40) + 10;
    const nationalityBreakdown = nationalities.map(nationality => ({
      nationality,
      count: Math.floor(Math.random() * (visits / 2))
    }));

    return {
      date: format(date, 'M/d (eee)', { locale: ko }),
      visits,
      nationalityBreakdown
    };
  }).reverse();

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      month: format(date, 'yyyy년 M월'),
      visits: Math.floor(Math.random() * 300) + 100
    };
  }).reverse();

  return {
    daily: dailyData,
    monthly: monthlyData,
    totalVisits: dailyData.reduce((sum, day) => sum + day.visits, 0),
    averageVisits: Math.round(dailyData.reduce((sum, day) => sum + day.visits, 0) / dailyData.length),
    maxVisitDay: dailyData.reduce((max, curr) => curr.visits > max.visits ? curr : max),
    nationalityStats: nationalities.map(nationality => ({
      nationality,
      count: Math.floor(Math.random() * 50) + 10
    }))
  };
};

export default function PatientTrends() {
  const { t } = useTranslation();
  const mockData = generateMockData();

  const { data: visits = [] } = useQuery<PatientVisit[]>({ 
    queryKey: ['/api/patient-visits'],
    enabled: false
  });

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          환자 방문 트렌드
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="daily" className="h-full">
          <div className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">일간</TabsTrigger>
              <TabsTrigger value="weekly">주간</TabsTrigger>
              <TabsTrigger value="monthly">월간</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="mt-0 h-[calc(100%-60px)]">
            <div className="h-[200px] px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value}명`, '방문 환자']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="url(#visitGradient)" 
                    strokeWidth={2}
                    dot={{ fill: "#0088FE", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#0088FE" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="px-6 mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">총 방문자 수</p>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-xl font-bold text-blue-700 mt-2">
                    {mockData.totalVisits}명
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">일일 평균</p>
                    <TrendingUp className="h-4 w-4 text-cyan-500" />
                  </div>
                  <p className="text-xl font-bold text-cyan-700 mt-2">
                    {mockData.averageVisits}명
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">최다 방문일</p>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-blue-700 mt-2">
                    {mockData.maxVisitDay.date}
                  </p>
                  <p className="text-xs text-blue-600">
                    ({mockData.maxVisitDay.visits}명)
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">국적별 방문자 현황</h4>
                <div className="space-y-2">
                  {mockData.nationalityStats.map((stat) => (
                    <div key={stat.nationality} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{stat.nationality}</span>
                        <span className="font-medium">{stat.count}명</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{
                            width: `${(stat.count / mockData.totalVisits) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}