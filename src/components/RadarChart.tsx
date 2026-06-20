import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AIAnalysis } from '../types';

interface RadarChartProps {
  analysis: AIAnalysis;
}

function levelToScore(level: string): number {
  const normalized = level.toLowerCase().replace(/[^a-z_]/g, '');
  const mapping: Record<string, number> = {
    none: 0,
    not_ready: 15,
    weak: 20,
    beginner: 25,
    preparing: 40,
    moderate: 50,
    intermediate: 55,
    ready: 70,
    active: 65,
    strong: 80,
    advanced: 85,
    expert: 95,
  };
  return mapping[normalized] ?? 50;
}

const RadarChart: React.FC<RadarChartProps> = ({ analysis }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const data = [
    { subject: 'DSA', value: levelToScore(analysis.dsa_strength), fullMark: 100 },
    { subject: 'CP', value: levelToScore(analysis.competitive_programming_level), fullMark: 100 },
    { subject: 'Open Source', value: levelToScore(analysis.open_source_level), fullMark: 100 },
    { subject: 'Consistency', value: analysis.overall_score, fullMark: 100 },
    { subject: 'Interview', value: levelToScore(analysis.interview_readiness), fullMark: 100 },
  ];

  const colors = isDark
    ? { grid: '#404040', axis: '#a1a1a1', radius: '#737373', stroke: '#ffffff', fill: '#ffffff', bg: 'rgba(20, 20, 20, 0.95)', border: '#333', text: '#fafafa' }
    : { grid: '#d4d4d4', axis: '#525252', radius: '#a3a3a3', stroke: '#171717', fill: '#171717', bg: 'rgba(255, 255, 255, 0.95)', border: '#e5e5e5', text: '#171717' };

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={colors.grid} strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: colors.axis, fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: colors.radius, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              color: colors.text,
            }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke={colors.stroke}
            fill={colors.fill}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
