import React from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChartDataPoint } from '../types';

interface SimulationChartProps {
  data: ChartDataPoint[];
  showTheoretical: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const freq = payload.find(p => p.dataKey === 'frequency');
    const theor = payload.find(p => p.dataKey === 'theoretical');

    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-dark-text mb-2 border-b pb-1.5">{`Outcome (k) = ${label}`}</p>
        <div className="space-y-1.5">
          {freq && (
            <div className="flex items-center justify-between space-x-4">
              <span className="text-light-text flex items-center">
                <span className="w-2.5 h-2.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                Observed Frequency
              </span>
              <span className="font-semibold text-primary-600">{(freq.value * 100).toFixed(2)}%</span>
            </div>
          )}
          {theor && (
             <div className="flex items-center justify-between space-x-4">
              <span className="text-light-text flex items-center">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-2 flex-shrink-0"></span>
                Theoretical Prob.
              </span>
              <span className="font-semibold text-amber-600">{(theor.value * 100).toFixed(2)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const SimulationChart: React.FC<SimulationChartProps> = ({ data, showTheoretical }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Run a simulation to see the results.</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="k" name="Number of Successes" label={{ value: 'Number of Successes / Events (k)', position: 'insideBottom', offset: -15 }} />
          <YAxis name="Probability" label={{ value: 'Frequency / Probability', angle: -90, position: 'insideLeft', offset: -10 }} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{paddingTop: 20}} />
          <Bar dataKey="frequency" fill="#3b82f6" name="Simulated Frequency" />
          {showTheoretical && <Line type="monotone" dataKey="theoretical" stroke="#f59e0b" strokeWidth={3} name="Theoretical Distribution" dot={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationChart;