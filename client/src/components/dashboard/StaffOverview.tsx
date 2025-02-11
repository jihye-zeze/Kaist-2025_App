import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, Languages, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "@/lib/i18n";

export default function StaffOverview() {
  const { t } = useTranslation();
  const { data: staff } = useQuery({ 
    queryKey: ['/api/staff']
  });

  const availableStaff = staff?.filter(s => s.isAvailable) || [];
  const interpreters = staff?.filter(s => s.role === 'interpreter') || [];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('staffOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('availableStaff')}
            </h3>
            <div className="space-y-2">
              {availableStaff.map((member) => (
                <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-secondary/10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role === 'doctor' ? '의사' : member.role === 'interpreter' ? '통역사' : member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('interpreterAvailability')}
            </h3>
            <div className="space-y-2">
              {interpreters.map((interpreter) => (
                <div key={interpreter.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{interpreter.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{interpreter.name}</p>
                      <div className="flex gap-1">
                        {interpreter.languages.map((lang) => (
                          <span key={lang} className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10">
                            {lang.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${interpreter.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}