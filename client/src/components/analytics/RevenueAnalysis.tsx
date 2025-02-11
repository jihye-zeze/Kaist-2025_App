import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// Blue color palette for pie chart
const BLUE_COLORS = ['#0064FF', '#00C4FF', '#60A5FA', '#93C5FD'];

const formatKRW = (value: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {name} ({value}명, {`${(percent * 100).toFixed(0)}%`})
    </text>
  );
};

export default function RevenueAnalysis() {
  const { data: treatments } = useQuery({ 
    queryKey: ['/api/treatments']
  });

  const { data: patients } = useQuery({
    queryKey: ['/api/patients']
  });

  // Calculate nationality distribution.  Handle cases where patients or revenue might be undefined.
  const nationalityDistribution = patients?.reduce((acc: any[], patient) => {
    const existingNationality = acc.find(item => item.nationality === patient.nationality);
    if (existingNationality) {
      existingNationality.count++;
      existingNationality.revenue += patient.revenue ? Number(patient.revenue) : 0; //Handle potential undefined revenue
    } else {
      acc.push({ 
        nationality: patient.nationality,
        count: 1,
        revenue: patient.revenue ? Number(patient.revenue) : 0 //Handle potential undefined revenue
      });
    }
    return acc;
  }, []) || [];

  const totalRevenue = treatments?.reduce((sum, treatment) => sum + Number(treatment.cost), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          환자 국적 분포  {/* Changed title to reflect pie chart data */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">환자 국적 분포</h3> {/* Clarified title */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nationalityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count" // Use count for pie chart data
                    nameKey="nationality"
                  >
                    {nationalityDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={BLUE_COLORS[index % BLUE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatKRW(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}