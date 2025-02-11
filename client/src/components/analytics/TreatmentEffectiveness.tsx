import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Stethoscope, TrendingUp, Award } from "lucide-react";

interface TreatmentOutcome {
  treatmentType: string;
  successRate: number;
  totalPatients: number;
  satisfactionRate: number;
}

// Enhanced mock data with more detailed statistics
const generateMockData = () => {
  const treatments = [
    {
      type: "다이어트",
      count: Math.floor(Math.random() * 20) + 30,
      successRate: 85 + Math.random() * 10,
      satisfactionRate: 90 + Math.random() * 8,
      returningPatients: Math.floor(Math.random() * 10) + 15,
      color: "#0088FE"
    },
    {
      type: "여드름",
      count: Math.floor(Math.random() * 15) + 25,
      successRate: 88 + Math.random() * 10,
      satisfactionRate: 92 + Math.random() * 6,
      returningPatients: Math.floor(Math.random() * 8) + 12,
      color: "#00C4FF"
    },
    {
      type: "리프팅",
      count: Math.floor(Math.random() * 25) + 35,
      successRate: 92 + Math.random() * 7,
      satisfactionRate: 94 + Math.random() * 5,
      returningPatients: Math.floor(Math.random() * 12) + 18,
      color: "#60A5FA"
    }
  ];

  return {
    treatments,
    totalPatients: treatments.reduce((sum, t) => sum + t.count, 0),
    averageSuccessRate: treatments.reduce((sum, t) => sum + t.successRate, 0) / treatments.length,
    averageSatisfaction: treatments.reduce((sum, t) => sum + t.satisfactionRate, 0) / treatments.length
  };
};

export default function TreatmentEffectiveness() {
  const mockData = generateMockData();

  const { data: outcomes } = useQuery<TreatmentOutcome[]>({ 
    queryKey: ['/api/treatment-outcomes'],
    enabled: false
  });

  const { data: treatments } = useQuery({ 
    queryKey: ['/api/treatments'],
    enabled: false
  });

  const effectivenessData = mockData.treatments;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Stethoscope className="h-5 w-5 text-blue-500" />
          치료 효과성 분석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">총 치료 환자</p>
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                {mockData.totalPatients}명
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">평균 성공률</p>
                <TrendingUp className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="text-2xl font-bold text-cyan-700 mt-2">
                {mockData.averageSuccessRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">만족도</p>
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                {mockData.averageSatisfaction.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Treatment Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">치료별 효과성</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={effectivenessData}>
                  <defs>
                    {effectivenessData.map((entry) => (
                      <linearGradient
                        key={`gradient-${entry.type}`}
                        id={`gradient-${entry.type}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={entry.color} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="type"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '성공률']}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="successRate"
                    radius={[4, 4, 0, 0]}
                  >
                    {effectivenessData.map((entry) => (
                      <Cell
                        key={entry.type}
                        fill={`url(#gradient-${entry.type})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treatment Details */}
          <div className="space-y-4">
            {effectivenessData.map((treatment) => (
              <div key={treatment.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{treatment.type}</span>
                  <span className="text-sm text-gray-600">
                    재방문율: {((treatment.returningPatients / treatment.count) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${treatment.successRate}%`,
                      background: `linear-gradient(90deg, ${treatment.color}CC, ${treatment.color})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>환자 수: {treatment.count}명</span>
                  <span>만족도: {treatment.satisfactionRate.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}