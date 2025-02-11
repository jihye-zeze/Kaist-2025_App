import { motion } from "framer-motion";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Country flag emojis
const COUNTRY_FLAGS: { [key: string]: string } = {
  '한국': '🇰🇷',
  '중국': '🇨🇳',
  '일본': '🇯🇵',
  '미국': '🇺🇸',
  '베트남': '🇻🇳',
  '러시아': '🇷🇺',
  '기타': '🌍'
};

// Mock patient names by nationality
const PATIENT_NAMES: { [key: string]: string[] } = {
  '한국': ['김민수', '이지은', '박성호'],
  '중국': ['Chen Wei', 'Li Wei', 'Zhang Min'],
  '일본': ['Tanaka Hiroshi', 'Sato Yuki', 'Suzuki Ken'],
  '미국': ['Alex Kim', 'Emma Smith', 'Michael Park'],
  '베트남': ['Nguyen Van', 'Tran Minh', 'Le Hoang'],
  '러시아': ['Ivan Popov', 'Anna Ivanova', 'Dmitri Kim']
};

// Temporary mock data generator
const generateMockFinancialData = () => {
  const countries = Object.keys(COUNTRY_FLAGS).filter(country => country !== '기타');
  const paymentMethods = ['신용카드', '현금', '보험', '계좌이체'];

  // Generate unpaid invoices with realistic patient names
  const unpaidInvoices = Array.from({ length: 5 }, (_, i) => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const patientName = PATIENT_NAMES[country][Math.floor(Math.random() * PATIENT_NAMES[country].length)];
    return {
      id: `INV-${2024}${String(i + 1).padStart(4, '0')}`,
      patientName,
      country,
      amount: Math.floor(Math.random() * 5000000) + 1000000,
      dueDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString('ko-KR'),
      status: i % 2 === 0 ? '미납' : '부분납부'
    };
  });

  return {
    totalRevenue: Math.floor(Math.random() * 50000000) + 100000000,
    patientCount: Math.floor(Math.random() * 50) + 100,
    avgRevenuePerPatient: Math.floor(Math.random() * 1000000) + 2000000,
    revenueByCountry: countries.map(country => ({
      country,
      revenue: Math.floor(Math.random() * 30000000) + 10000000,
      patients: Math.floor(Math.random() * 20) + 5
    })),
    paymentMethodStats: paymentMethods.map(method => ({
      method,
      value: Math.floor(Math.random() * 30) + 10,
    })),
    unpaidInvoices
  };
};

// Update colors to blue-cyan theme
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function FinancialManagement() {
  const [date, setDate] = useState<Date>(new Date());
  const { t } = useTranslation();

  // Replace with actual API call when ready
  const mockData = generateMockFinancialData();

  const formatKRW = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExport = () => {
    // Add export logic here
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">재무 관리</h1>
              <DatePicker date={date} setDate={setDate} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <Download className="h-4 w-4" />
              내보내기 (.CSV)
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">총 수익</p>
                      <p className="text-2xl font-bold mt-1">
                        {formatKRW(mockData.totalRevenue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-[#00AEEF] to-[#0096CE] text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">외국인 환자 수</p>
                        <p className="text-3xl font-bold mt-1 text-shadow tracking-tight">
                          {mockData.patientCount}<span className="text-lg ml-1">명</span>
                        </p>
                      </div>
                      <motion.div 
                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Users className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-[#0082C8] to-[#006CAE] text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">환자당 평균 수익</p>
                        <p className="text-3xl font-bold mt-1 text-shadow tracking-tight">
                          {formatKRW(mockData.avgRevenuePerPatient)}
                        </p>
                      </div>
                      <motion.div 
                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                        whileHover={{ rotate: -15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <TrendingUp className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>국가별 수익 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockData.revenueByCountry}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                        dataKey="country"
                        tickFormatter={(country) => `${COUNTRY_FLAGS[country]} ${country}`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000000}M`}
                        style={{ fontSize: '12px' }}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip
                        formatter={(value: any) => formatKRW(value)}
                        labelFormatter={(country) => `${COUNTRY_FLAGS[country]} ${country}`}
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
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>결제 방법 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col items-center">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <linearGradient
                              key={`gradient-${index}`}
                              id={`pieGradient-${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={color}
                                stopOpacity={1}
                              />
                              <stop
                                offset="100%"
                                stopColor={color}
                                stopOpacity={0.6}
                              />
                            </linearGradient>
                          ))}
                          <filter id="pieGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <Pie
                          data={mockData.paymentMethodStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          innerRadius={60}
                          dataKey="value"
                          filter="url(#pieGlow)"
                        >
                          {mockData.paymentMethodStats.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#pieGradient-${index})`}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {mockData.paymentMethodStats.map((entry, index) => (
                      <div key={entry.method} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{entry.method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>미수금 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">청구번호</th>
                        <th className="text-left py-3 px-4">환자명</th>
                        <th className="text-left py-3 px-4">국가</th>
                        <th className="text-left py-3 px-4">금액</th>
                        <th className="text-left py-3 px-4">납부기한</th>
                        <th className="text-left py-3 px-4">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.unpaidInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{invoice.id}</td>
                          <td className="py-3 px-4">{invoice.patientName}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-2">
                              {COUNTRY_FLAGS[invoice.country]} {invoice.country}
                            </span>
                          </td>
                          <td className="py-3 px-4">{formatKRW(invoice.amount)}</td>
                          <td className="py-3 px-4">{invoice.dueDate}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === '미납'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

const formatKRW = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
};