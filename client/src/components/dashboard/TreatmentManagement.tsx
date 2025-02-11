import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Stethoscope, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n";

// Generate mock data if no real data exists
const generateMockTreatmentData = () => {
  const treatmentTypes = [
    { type: "침술", baseCount: 25 },
    { type: "한약", baseCount: 20 },
    { type: "물리치료", baseCount: 15 },
    { type: "부항", baseCount: 10 }
  ];

  const randomVariation = () => 0.8 + Math.random() * 0.4; // Random variation between 0.8 and 1.2
  const baseCost = 50000; // Base cost per treatment (50,000 KRW)

  return treatmentTypes.map(treatment => ({
    type: treatment.type,
    count: Math.round(treatment.baseCount * randomVariation()),
    revenue: Math.round(treatment.baseCount * baseCost * randomVariation()),
  }));
};

// Generate mock inventory alerts
const generateMockInventoryAlerts = () => {
  const inventoryItems = [
    { name: "인삼", threshold: 100, current: Math.floor(Math.random() * 50) + 30 },
    { name: "침술 용품", threshold: 200, current: Math.floor(Math.random() * 80) + 50 },
    { name: "당귀", threshold: 80, current: Math.floor(Math.random() * 40) + 20 }
  ];

  return inventoryItems.filter(item => item.current < item.threshold)
    .map(item => ({
      name: item.name,
      remaining: item.current,
      threshold: item.threshold
    }));
};

export default function TreatmentManagement() {
  const { t } = useTranslation();
  const { data: treatments } = useQuery({ 
    queryKey: ['/api/treatments']
  });

  // Use mock data if no real data exists
  const mockTreatments = generateMockTreatmentData();
  const treatmentStats = treatments?.reduce((acc: any, treatment) => {
    if (!acc[treatment.type]) {
      acc[treatment.type] = {
        count: 0,
        revenue: 0,
      };
    }
    acc[treatment.type].count++;
    acc[treatment.type].revenue += Number(treatment.cost);
    return acc;
  }, {}) || {};

  const treatmentTypes = Object.entries(treatmentStats).length > 0 
    ? Object.entries(treatmentStats).map(([type, stats]: [string, any]) => ({
        type,
        count: stats.count,
        revenue: stats.revenue,
        percentage: (stats.count / (treatments?.length || 1)) * 100,
      }))
    : mockTreatments.map(treatment => ({
        type: treatment.type,
        count: treatment.count,
        revenue: treatment.revenue,
        percentage: (treatment.count / mockTreatments.reduce((sum, t) => sum + t.count, 0)) * 100,
      }));

  // Generate inventory alerts
  const inventoryAlerts = generateMockInventoryAlerts();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          {t('treatmentManagement')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {treatmentTypes.map((treatment) => (
              <div key={treatment.type} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{treatment.type}</span>
                  <span className="text-sm text-muted-foreground">
                    {treatment.count}건 ({formatKRW(treatment.revenue)})
                  </span>
                </div>
                <Progress value={treatment.percentage} 
                  className="bg-blue-100"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{t('inventoryAlerts')}</span>
            </div>
            <ul className="mt-2 space-y-2">
              {inventoryAlerts.map((alert, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {alert.name} 재고 부족 (현재: {alert.remaining}개, 기준: {alert.threshold}개)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const formatKRW = (value: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
};