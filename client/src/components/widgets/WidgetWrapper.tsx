import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { WidgetProps } from "./types";

export function WidgetWrapper({ config, onSettingsChange, children }: WidgetProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full"
    >
      <Card className="h-full bg-white/90 backdrop-blur-sm shadow-toss hover:shadow-toss-hover transition-all duration-300 flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">{config.title}</CardTitle>
            {onSettingsChange && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {onSettingsChange && (
            <Collapsible open={isSettingsOpen}>
              <CollapsibleContent className="space-y-2 mb-4">
                {/* Add widget-specific settings here */}
                <div className="text-sm text-muted-foreground">
                  위젯 설정
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          <div className="flex-1 min-h-0 overflow-auto">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}