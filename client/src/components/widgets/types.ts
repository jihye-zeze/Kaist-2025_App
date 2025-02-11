import { ReactNode } from 'react';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
  minW?: number;
  minH?: number;
  settings?: Record<string, any>;
}

export interface WidgetProps {
  config: WidgetConfig;
  onSettingsChange?: (settings: Record<string, any>) => void;
  children?: ReactNode;
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
  layout: {
    cols: number;
    rowHeight: number;
    width: string;
  };
}
