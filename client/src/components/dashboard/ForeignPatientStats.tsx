import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "@/lib/i18n";

// Modern blue color palette with gradients
const BLUE_COLORS = {
  KR: ['#0064FF', '#60A5FA'],
  US: ['#00C4FF', '#93C5FD'],
  CN: ['#3B82F6', '#60A5FA'],
  JP: ['#2563EB', '#93C5FD']
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
  const radius = outerRadius * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const innerX = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
  const innerY = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);

  const textAnchor = x > cx ? 'start' : 'end';
  const percentValue = (percent * 100).toFixed(0);

  return (
    <g>
      {/* Curved connecting line with gradient */}
      <path
        d={`M ${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${
          cy + outerRadius * Math.sin(-midAngle * RADIAN)
        } Q ${innerX},${innerY} ${x},${y}`}
        stroke={BLUE_COLORS[name as keyof typeof BLUE_COLORS][0]}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        filter="url(#shadow)"
      />
      {/* Label text with enhanced styling */}
      <text 
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="#374151"
        className="text-sm font-medium"
        filter="url(#shadow)"
      >
        {name} ({value}명)
      </text>
      <text
        x={x}
        y={y + 16}
        textAnchor={textAnchor}
        fill="#6B7280"
        className="text-xs"
        filter="url(#shadow)"
      >
        {percentValue}%
      </text>
    </g>
  );
};

export default function ForeignPatientStats() {
  const { t } = useTranslation();
  const { data: patients } = useQuery({ 
    queryKey: ['/api/patients']
  });

  const nationalityData = [
    { nationality: 'KR', value: 5 },
    { nationality: 'US', value: 3 },
    { nationality: 'CN', value: 3 },
    { nationality: 'JP', value: 2 }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('foreignPatientStats')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('patientNationality')}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Define gradients for each nationality */}
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
                  {/* Add shadow filter for 3D effect */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                  </filter>
                </defs>
                <Pie
                  data={nationalityData}
                  dataKey="value"
                  nameKey="nationality"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {nationalityData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.nationality}`} 
                      fill={`url(#gradient-${entry.nationality})`}
                      stroke="white"
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-80"
                      style={{
                        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}