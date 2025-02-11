import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({ value, suffix = "", className = "" }: AnimatedNumberProps) {
  const [isChanged, setIsChanged] = useState(false);
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
    setIsChanged(true);
    const timer = setTimeout(() => setIsChanged(false), 2000);
    return () => clearTimeout(timer);
  }, [value, spring]);

  return (
    <div className="relative inline-block">
      <motion.span
        className={className}
        initial={false}
        animate={{ color: isChanged ? "#3B82F6" : "#1F2937" }}
        transition={{ duration: 2 }}
      >
        <motion.span>{display}</motion.span>
        {suffix}
      </motion.span>
      {isChanged && (
        <motion.div
          className="absolute inset-0 -z-10 bg-blue-100/50 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}
