'use client';

import type { BaseSubmission } from '@/types/submissions';
import { formatDate, isQuantumSubmission } from '@/utils';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartDatum<T> = {
  ts: number;
  y: number;
  submission: T;
  fill: string;
};

type SubmissionsChartProps<T extends BaseSubmission> = {
  submissions: T[];
  getValue: (submission: T) => number | null;
  yLabel: string;
  yTooltipLabel: string;
  yTooltipSuffix?: string;
  yScale?: 'linear' | 'log';
};

const tickDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function SubmissionsChart<T extends BaseSubmission>(props: SubmissionsChartProps<T>) {
  const { submissions, getValue, yLabel, yTooltipLabel, yTooltipSuffix, yScale = 'linear' } = props;

  const data: ChartDatum<T>[] = submissions.flatMap((submission) => {
    const y = getValue(submission);
    if (y === null) return [];
    if (yScale === 'log' && y <= 0) return [];
    const fill = isQuantumSubmission(submission)
      ? 'var(--primary)'
      : 'var(--color-classical-submission)';
    return [{ ts: new Date(submission.createdAt).getTime(), y, submission, fill }];
  });

  if (data.length === 0) return null;

  const timestamps = data.map((d) => d.ts);
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const tsRange = maxTs - minTs;
  const tsPad = tsRange > 0 ? tsRange * 0.05 : 86_400_000;
  const xDomain: [number, number] = [minTs - tsPad, maxTs + tsPad];

  let yDomain: [number, number] | ['auto', 'auto'] = ['auto', 'auto'];
  if (yScale === 'log') {
    const ys = data.map((d) => d.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const logRange = Math.log10(maxY) - Math.log10(minY);
    const factor = Math.pow(10, logRange > 0 ? logRange * 0.05 : 0.1);
    yDomain = [minY / factor, maxY * factor];
  }

  return (
    <div className="h-64 w-full md:h-80 [&_*:focus]:outline-none [&_.recharts-symbols]:cursor-pointer">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="ts"
            domain={xDomain}
            tickCount={10}
            tickFormatter={(ts: number) => tickDateFormatter.format(ts)}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            stroke="var(--border)"
            label={{
              value: 'Date',
              position: 'insideBottom',
              offset: -8,
              style: { fontSize: 12, fontWeight: 700, fill: 'var(--foreground)' },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            scale={yScale}
            domain={yDomain}
            tickCount={8}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            stroke="var(--border)"
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              style: {
                textAnchor: 'middle',
                fontSize: 12,
                fontWeight: 700,
                fill: 'var(--foreground)',
              },
            }}
          />
          <Tooltip
            cursor={{ stroke: 'var(--border)', strokeDasharray: '3 3' }}
            wrapperStyle={{ transition: 'none' }}
            isAnimationActive={false}
            content={
              <ChartTooltip yTooltipLabel={yTooltipLabel} yTooltipSuffix={yTooltipSuffix} />
            }
          />
          <Scatter
            data={data}
            isAnimationActive={false}
            onClick={(entry: { payload?: ChartDatum<T> }) => {
              const url = entry?.payload?.submission.url;
              if (url) window.open(url, '_blank', 'noopener,noreferrer');
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

type ChartTooltipProps<T extends BaseSubmission> = {
  active?: boolean;
  payload?: { payload: ChartDatum<T> }[];
  yTooltipLabel: string;
  yTooltipSuffix?: string;
};

function ChartTooltip<T extends BaseSubmission>(props: ChartTooltipProps<T>) {
  const { active, payload, yTooltipLabel, yTooltipSuffix } = props;
  if (!active || !payload?.length) return null;

  const { submission, y, fill } = payload[0].payload;

  return (
    <div
      className="bg-popover text-popover-foreground animate-in fade-in border border-l-4 px-3 py-2 text-sm shadow-md duration-150"
      style={{ borderLeftColor: fill }}
    >
      <div className="mb-1 font-medium">{submission.method}</div>
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <span className="text-muted-foreground">Date</span>
        <span className="text-right tabular-nums">{formatDate(submission.createdAt)}</span>
        <span className="text-muted-foreground">{yTooltipLabel}</span>
        <span className="text-right tabular-nums">
          {y}
          {yTooltipSuffix ?? ''}
        </span>
      </div>
    </div>
  );
}
