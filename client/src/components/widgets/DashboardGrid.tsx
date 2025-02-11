import { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DashboardConfig } from './types';

interface DashboardGridProps {
  config: DashboardConfig;
  onLayoutChange?: (layout: any[]) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  children: ReactElement[];
}

export function DashboardGrid({ 
  config, 
  onLayoutChange, 
  isDraggable = false,
  isResizable = false,
  children 
}: DashboardGridProps) {
  const layout = config.widgets.map((widget) => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.width,
    h: widget.height,
    minW: widget.minW || 3,
    minH: widget.minH || 2,
    maxW: widget.maxW,
    maxH: widget.maxH,
  }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={config.layout.cols}
      rowHeight={config.layout.rowHeight}
      containerPadding={[16, 16]}
      margin={[16, 16]}
      width={1200}
      isDraggable={isDraggable}
      isResizable={isResizable}
      onLayoutChange={onLayoutChange}
      useCSSTransforms={true}
      compactType="vertical"
      preventCollision={false}
    >
      {children}
    </GridLayout>
  );
}