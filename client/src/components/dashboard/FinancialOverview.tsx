import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "@/lib/i18n";

const formatKRW = (value: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
};

// Generate mock data if no real data exists
const generateMockFinancialData = (date: Date) => {
  const baseRevenue = 2500000; // Base daily revenue (2.5M KRW)
  const dayOfWeek = date.getDay();

  // More revenue on weekdays, less on weekends
  const dayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.3;
  const randomVariation = () => 0.85 + Math.random() * 0.3; // Random variation between 0.85 and 1.15

  const dailyRevenue = Math.round(baseRevenue * dayMultiplier * randomVariation());

  // Generate mock revenue by nationality
  const nationalities = ['한국', '중국', '일본', '미국', '베트남'];
  const revenueByNationality = nationalities.map(nationality => ({
    nationality,
    revenue: Math.round(baseRevenue * (0.3 + Math.random() * 0.7)) // Random revenue between 30% and 100% of base
  }));

  return {
    dailyRevenue,
    revenueByNationality
  };
};

export default function FinancialOverview() {
  const { t } = useTranslation();
  const { data: treatments } = useQuery({ 
    queryKey: ['/api/treatments']
  });
  const { data: patients } = useQuery({
    queryKey: ['/api/patients']
  });

  // Use mock data if no real data exists
  const mockData = generateMockFinancialData(new Date());
  const dailyRevenue = treatments?.reduce((sum, treatment) => sum + Number(treatment.cost), 0) || mockData.dailyRevenue;

  // Calculate revenue by nationality using real data if available, otherwise use mock
  const revenueByNationality = patients?.reduce((acc: any[], patient) => {
    const patientTreatments = treatments?.filter(t => t.patientId === patient.id) || [];
    const revenue = patientTreatments.reduce((sum, t) => sum + Number(t.cost), 0);

    const existingNationality = acc.find(item => item.nationality === patient.nationality);
    if (existingNationality) {
      existingNationality.revenue += revenue;
    } else if (revenue > 0) {
      acc.push({ nationality: patient.nationality, revenue });
    }
    return acc;
  }, []) || mockData.revenueByNationality;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {t('financialOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t('dailyRevenue')}</p>
              <p className="text-2xl font-bold">{formatKRW(dailyRevenue)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-toss-blue" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">{t('cardPayments')}</span>
              </div>
              <span className="text-sm font-medium">70%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">{t('cashPayments')}</span>
              </div>
              <span className="text-sm font-medium">30%</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{t('revenueByNationality')}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={revenueByNationality}
                  barSize={20}
                >
                  <defs>
                    {/* Enhanced gradient with 3D effect */}
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0064FF" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6}/>
                    </linearGradient>
                    {/* Add shadow filter for 3D effect */}
                    <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.1"/>
                    </filter>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis 
                    dataKey="nationality" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value / 10000}만원`} 
                    style={{ fontSize: '12px' }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    formatter={(value) => formatKRW(Number(value))}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#shadow3D)"
                    className="transition-all duration-300"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}