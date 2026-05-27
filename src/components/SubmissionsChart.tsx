'use client';

import type { BaseSubmission } from '@/types/submissions';
import { formatDate } from '@/utils';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ONE_DAY_MS = 86_400_000;

type ChartDatum<T> = {
  ts: number;
  y: number;
  submission: T;
};

type SubmissionsChartProps<T extends BaseSubmission> = {
  submissions: T[];
  getValue: (submission: T) => number | null;
  yLabel: string;
  yTooltipLabel: string;
  yTooltipSuffix?: string;
};

const tickDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function SubmissionsChart<T extends BaseSubmission>(props: SubmissionsChartProps<T>) {
  const { submissions, getValue, yLabel, yTooltipLabel, yTooltipSuffix } = props;

  const data: ChartDatum<T>[] = submissions.flatMap((submission) => {
    const y = getValue(submission);
    if (y === null) return [];
    return [{ ts: new Date(submission.createdAt).getTime(), y, submission }];
  });

  if (data.length === 0) return null;

  const timestamps = data.map((d) => d.ts);
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const range = maxTs - minTs;
  const padMs = range > 0 ? range * 0.05 : ONE_DAY_MS;
  const domain: [number, number] = [minTs - padMs, maxTs + padMs];

  return (
    <div className="h-64 w-full md:h-80 [&_*:focus]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="ts"
            domain={domain}
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
            domain={['auto', 'auto']}
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
          <Scatter data={data} fill="var(--primary)" isAnimationActive={false} />
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

  const { submission, y } = payload[0].payload;

  return (
    <div className="bg-popover text-popover-foreground border-l-primary animate-in fade-in border border-l-4 px-3 py-2 text-sm shadow-md duration-150">
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
