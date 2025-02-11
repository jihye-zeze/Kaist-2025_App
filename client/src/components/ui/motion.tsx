import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// Toss-style hover animation preset
export const hoverScale = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

// Smooth fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

// Smooth slide up animation
export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" }
};

// Interactive card component with hover effect
export function MotionCard({ 
  children, 
  className, 
  ...props 
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={hoverScale}
      className={cn(
        "bg-white/90 backdrop-blur-sm rounded-2xl shadow-toss",
        "hover:shadow-toss-hover active:shadow-toss-active",
        "transition-all duration-300 will-change-transform",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({ 
  children,
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Interactive button with press animation
export function MotionButton({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-xl px-4 py-2 font-medium",
        "bg-toss-blue text-white",
        "hover:bg-blue-600 active:bg-blue-700",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Loading spinner with smooth animation
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "w-5 h-5 border-2 border-toss-blue rounded-full",
        "border-t-transparent animate-spin",
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Smooth list item animation
export function ListItem({
  children,
  delay = 0,
  className,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
