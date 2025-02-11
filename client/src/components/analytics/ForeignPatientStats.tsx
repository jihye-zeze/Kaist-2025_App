import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Globe, Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTranslation } from "@/lib/i18n";

// Modern blue-cyan color palette for consistency
const BLUE_COLORS = {
  KR: ['#0064FF', '#60A5FA'],
  US: ['#00C4FF', '#93C5FD'],
  CN: ['#3B82F6', '#60A5FA'],
  JP: ['#2563EB', '#93C5FD'],
  VN: ['#1E40AF', '#3B82F6']
};

// Enhanced mock data with realistic percentages
const generateMockData = () => {
  const data = [
    { nationality: 'KR', value: 40, label: '한국' },
    { nationality: 'US', value: 25, label: '미국' },
    { nationality: 'CN', value: 20, label: '중국' },
    { nationality: 'JP', value: 15, label: '일본' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  return { data, total };
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, nationality }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{data.label}</p>
        <p className="text-sm text-gray-600">
          {data.value}명 ({(data.value / 100 * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function ForeignPatientStats() {
  const { t } = useTranslation();
  const { data: mockData } = useQuery({
    queryKey: ['mockNationalityData'],
    queryFn: generateMockData,
    enabled: true,
    initialData: generateMockData()
  });

  const { data: patients } = useQuery({ 
    queryKey: ['/api/patients'],
    enabled: false
  });

  return (
    <Card className="col-span-1 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Globe className="h-5 w-5 text-blue-500" />
          {t('foreignPatientStats')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {/* Total Patients Summary */}
          <div className="mb-4 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">총 외국인 환자</p>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {mockData.total}명
            </p>
          </div>

          <h3 className="text-sm font-medium mb-4 text-gray-700 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            {t('patientNationality')}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {Object.entries(BLUE_COLORS).map(([nationality, [startColor, endColor]]) => (
                    <linearGradient
                      key={nationality}
                      id={`gradient-${nationality}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={startColor} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={endColor} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={mockData.data}
                  dataKey="value"
                  nameKey="nationality"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {mockData.data.map((entry) => (
                    <Cell
                      key={entry.nationality}
                      fill={`url(#gradient-${entry.nationality})`}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value, entry: any) => entry.payload.label}
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    paddingLeft: "20px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Nationality Breakdown */}
          <div className="mt-4 space-y-2">
            {mockData.data.map((item) => (
              <div key={item.nationality} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-800">
                  {item.value}명 ({((item.value / mockData.total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}