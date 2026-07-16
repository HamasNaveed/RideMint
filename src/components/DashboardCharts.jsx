import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart2 } from 'lucide-react';

export default function DashboardCharts({ transactions, selectedMonth, onMonthChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Helper: Get month name from YYYY-MM
  const getMonthName = (monthStr) => {
    if (!monthStr || monthStr === 'all') return 'All Months';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  // 1. Get unique months list for the dropdown filter
  const monthsList = Array.from(
    new Set(
      transactions
        .filter(t => t.rawDate)
        .map(t => t.rawDate.substring(0, 7))
    )
  ).sort().reverse(); // Show latest months first

  // 2. Prepare Chart Data based on current mode
  let chartData = [];
  let isDailyMode = selectedMonth !== 'all';

  const earningTx = transactions.filter(t => t.Type === 'Earning' && t.rawDate);

  if (isDailyMode) {
    // DAILY MODE: Show earnings per day for the selected month
    const [year, month] = selectedMonth.split('-');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    // Calculate number of days in the month
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    
    // Initialize daily values
    const dailyMap = {};
    for (let day = 1; day <= daysInMonth; day++) {
      dailyMap[day] = 0;
    }

    // Populate daily earnings
    earningTx.forEach(tx => {
      const txMonth = tx.rawDate.substring(0, 7);
      if (txMonth === selectedMonth) {
        const txDay = parseInt(tx.rawDate.substring(8, 10));
        if (dailyMap[txDay] !== undefined) {
          dailyMap[txDay] += Number(tx['Amount (PKR)']);
        }
      }
    });

    chartData = Object.keys(dailyMap).map(day => ({
      label: `Day ${day}`,
      shortLabel: day,
      value: dailyMap[day]
    }));
  } else {
    // MONTHLY MODE: Show earnings per month
    const monthlyMap = {};
    
    // Sort transactions chronologically to build the chart left-to-right
    const chronologicalEarnings = [...earningTx].sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    chronologicalEarnings.forEach(tx => {
      const monthKey = tx.rawDate.substring(0, 7);
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = 0;
      }
      monthlyMap[monthKey] += Number(tx['Amount (PKR)']);
    });

    chartData = Object.keys(monthlyMap).map(monthKey => ({
      label: getMonthName(monthKey),
      shortLabel: getMonthName(monthKey).split(' ')[0], // e.g. "Jul" from "Jul 2026"
      value: monthlyMap[monthKey]
    }));
  }

  // Calculate total earnings shown in chart
  const totalChartEarnings = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // SVG Chart parameters
  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 40, right: 30, bottom: 50, left: 65 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Find max value for Y-scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 0) || 1000;
  // Round up to a nice clean division (e.g. next 1000 or 5000)
  const yAxisMax = Math.ceil(maxValue / 1000) * 1000;

  // X coordinate calculation
  const getX = (index) => {
    return padding.left + index * (chartWidth / chartData.length);
  };

  // Y coordinate calculation
  const getY = (value) => {
    return padding.top + chartHeight - (value / yAxisMax) * chartHeight;
  };

  // Bar width
  const barWidth = (chartWidth / chartData.length) * 0.7;

  // Helper to format Y-axis labels (e.g. 15000 -> "15k")
  const formatYLabel = (val) => {
    if (val >= 1000) {
      return `Rs ${(val / 1000).toFixed(0)}k`;
    }
    return `Rs ${val}`;
  };

  return (
    <div className="glass-panel mb-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white border-opacity-10">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-accent-primary" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isDailyMode ? `Daily Earnings - ${getMonthName(selectedMonth)}` : 'Monthly Earnings Overview'}
            </h3>
            <p className="text-muted text-xs">
              {isDailyMode 
                ? 'Showing daily performance for selected month' 
                : 'Showing total earnings aggregated by month'}
            </p>
          </div>
        </div>

        {/* Dropdown filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar size={16} className="text-muted" />
          <select 
            value={selectedMonth} 
            onChange={(e) => onMonthChange(e.target.value)}
            className="form-select text-sm py-1.5 px-3"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">All Months</option>
            {monthsList.map(m => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12 text-muted">
          No earnings transactions logged to display charts. Add entries above.
        </div>
      ) : (
        <div>
          {/* Responsive SVG Chart Container */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              width="100%" 
              style={{ minWidth: '500px', display: 'block' }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Grid Lines (Horizontal) */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const val = yAxisMax * ratio;
                const yPos = getY(val);
                return (
                  <g key={index}>
                    <line 
                      x1={padding.left} 
                      y1={yPos} 
                      x2={svgWidth - padding.right} 
                      y2={yPos} 
                      stroke="rgba(255,255,255,0.06)" 
                      strokeWidth={1}
                      strokeDasharray={index === 0 ? "0" : "4 4"}
                    />
                    <text 
                      x={padding.left - 10} 
                      y={yPos + 4} 
                      textAnchor="end" 
                      fill="var(--text-muted)" 
                      fontSize={10}
                      fontFamily="system-ui"
                    >
                      {formatYLabel(val)}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {chartData.map((d, idx) => {
                const bHeight = (d.value / yAxisMax) * chartHeight;
                const xPos = getX(idx) + (chartWidth / chartData.length - barWidth) / 2;
                const yPos = getY(d.value);
                const isHovered = hoveredIndex === idx;

                return (
                  <g key={idx}>
                    {/* Background trigger for hover - wider target for easy selection */}
                    <rect
                      x={getX(idx)}
                      y={padding.top}
                      width={chartWidth / chartData.length}
                      height={chartHeight}
                      fill="transparent"
                      cursor="pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    
                    {/* Actual Bar */}
                    <rect
                      x={xPos}
                      y={yPos}
                      width={barWidth}
                      height={Math.max(bHeight, 2)}
                      rx={Math.min(barWidth / 2, 4)}
                      fill={isHovered ? "url(#barHoverGradient)" : "url(#barGradient)"}
                      style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                    />

                    {/* X-Axis Labels */}
                    {(!isDailyMode || idx % 2 === 0 || idx === chartData.length - 1) && (
                      <text
                        x={getX(idx) + (chartWidth / chartData.length) / 2}
                        y={svgHeight - padding.bottom + 18}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize={isDailyMode ? 9 : 11}
                        fontFamily="system-ui"
                      >
                        {d.shortLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* X-Axis Line */}
              <line 
                x1={padding.left} 
                y1={svgHeight - padding.bottom} 
                x2={svgWidth - padding.right} 
                y2={svgHeight - padding.bottom} 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth={1}
              />

              {/* Floating Tooltip Component inside SVG */}
              {hoveredIndex !== null && chartData[hoveredIndex] && (
                (() => {
                  const d = chartData[hoveredIndex];
                  const barCenter = getX(hoveredIndex) + (chartWidth / chartData.length) / 2;
                  const barTopY = getY(d.value);
                  
                  const tooltipWidth = 140;
                  const tooltipX = Math.max(padding.left + tooltipWidth/2, Math.min(svgWidth - padding.right - tooltipWidth/2, barCenter));
                  const tooltipY = Math.max(padding.top + 45, barTopY);

                  return (
                    <g style={{ pointerEvents: 'none' }} className="animate-fade-in">
                      <circle cx={barCenter} cy={barTopY} r={4} fill="#fff" stroke="#3b82f6" strokeWidth={2} />
                      
                      <rect
                        x={tooltipX - tooltipWidth / 2}
                        y={tooltipY - 50}
                        width={tooltipWidth}
                        height={42}
                        rx={6}
                        fill="rgba(15, 23, 42, 0.98)"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth={1}
                      />
                      
                      <text
                        x={tooltipX}
                        y={tooltipY - 37}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize={9}
                        fontFamily="system-ui"
                      >
                        {d.label}
                      </text>
                      
                      <text
                        x={tooltipX}
                        y={tooltipY - 22}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={11}
                        fontWeight="bold"
                        fontFamily="system-ui"
                      >
                        Rs {d.value.toLocaleString()}
                      </text>
                    </g>
                  );
                })()
              )}
            </svg>
          </div>
          
          {/* Chart metrics footer */}
          <div className="flex justify-between items-center mt-3 text-xs text-muted px-2">
            <div>
              <span>Chart Range: </span>
              <span className="text-white font-medium">
                {isDailyMode ? `${chartData.length} Days` : `${chartData.length} Months`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-success" />
              <span>Total Earnings in View: </span>
              <span className="text-success font-semibold">Rs {totalChartEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
