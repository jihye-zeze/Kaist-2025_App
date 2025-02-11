import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// Modern blue-cyan color palette
const COLORS = {
  scheduled: '#0088FE',
  cancelled: '#00C4FF',
  noShow: '#60A5FA'
};

// Enhanced mock data generation
const generateMockData = () => {
  // Calculate status distribution with fixed percentages
  const statusStats = [
    { 
      status: 'scheduled', 
      value: 60,
      label: '예약됨',
      color: COLORS.scheduled
    },
    { 
      status: 'cancelled', 
      value: 25,
      label: '취소됨',
      color: COLORS.cancelled
    },
    { 
      status: 'noShow', 
      value: 15,
      label: 'No-Show',
      color: COLORS.noShow
    }
  ].map(stat => ({
    ...stat,
    fill: stat.color
  }));

  // Generate daily appointment data
  const appointmentsByDay = Array.from({ length: 7 }, (_, i) => ({
    day: format(new Date(2024, 1, i + 1), 'EEEE', { locale: ko }),
    count: Math.floor(Math.random() * 20) + 10
  }));

  return {
    statusStats,
    appointmentsByDay,
    cancelRate: 25
  };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{data.label}</p>
        <p className="text-sm text-gray-600">
          {data.value}% ({Math.round(data.value)}건)
        </p>
      </div>
    );
  }
  return null;
};

export default function AppointmentPatterns() {
  const mockData = generateMockData();

  const { data: appointments } = useQuery({ 
    queryKey: ['/api/appointments'],
    enabled: false
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="h-5 w-5 text-blue-500" />
          예약 패턴 분석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">요일별 예약 현황</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={mockData.appointmentsByDay}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0064FF" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [`${value}건`, '예약 수']}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <AlertCircle className="h-4 w-4 text-red-500" />
              예약 취소율
            </h3>
            <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
              <span className="text-gray-700">최근 예약 취소율</span>
              <span className="font-medium text-red-600">{mockData.cancelRate.toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4 text-gray-700">예약 상태 분포</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData.statusStats}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                >
                  <defs>
                    {Object.entries(COLORS).map(([key, color]) => (
                      <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={60}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar
                    dataKey="value"
                    minPointSize={2}
                    barSize={30}
                  >
                    {mockData.statusStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${entry.status})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}