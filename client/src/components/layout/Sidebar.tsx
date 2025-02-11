import { HomeIcon, Users, DollarSign, Calendar, Settings, BarChart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { HerbalMedicinePotIcon } from "@/components/ui/icons";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: HomeIcon, label: "대시보드", href: "/" },
  { icon: Calendar, label: "예약 관리", href: "/appointments" },
  { icon: Users, label: "환자 관리", href: "/patients" },
  { icon: HerbalMedicinePotIcon, label: "치료 관리", href: "/treatments" },
  { icon: ShieldCheck, label: "보험 관리", href: "/insurance" },
  { icon: DollarSign, label: "재무 관리", href: "/finance" },
  { icon: BarChart, label: "분석", href: "/analytics" },
  { icon: Settings, label: "설정", href: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "w-60 bg-white/95 backdrop-blur-md border-r border-gray-100 shadow-toss h-screen",
        className
      )}
    >
      <div className="p-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-toss-blue to-blue-500 bg-clip-text text-transparent"
        >
          메디트립 시스템
        </motion.h1>
      </div>

      <nav className="px-4">
        {menuItems.map((item, index) => (
          <motion.a
            key={item.href}
            href={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group flex items-center gap-3 px-6 py-4 rounded-xl mb-2",
              "transition-all duration-200 ease-in-out",
              location === item.href 
                ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-toss-blue shadow-sm' 
                : 'text-toss-gray hover:bg-gray-50/80'
            )}
          >
            <item.icon className={cn("h-5 w-5 transition-colors",
              location === item.href 
                ? 'text-toss-blue' 
                : 'text-toss-gray-light group-hover:text-toss-gray'
            )} />
            <span className={cn("font-medium text-sm",
              location === item.href 
                ? 'text-toss-blue' 
                : 'text-toss-gray-light group-hover:text-toss-gray'
            )}>
              {item.label}
            </span>
          </motion.a>
        ))}
      </nav>
    </motion.div>
  );
}