import React, { useState } from 'react';
import { ZScoreInput, ZScoreResult } from '../types';
import { calculateZScore, calculateProbabilityBetween, calculateNormalPDF } from '../services/simulationService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

const ZScoreCalculator: React.FC = () => {
  const [input, setInput] = useState<ZScoreInput>({
    value: 85,
    mean: 70,
    stdDev: 10
  });

  const [result, setResult] = useState<ZScoreResult | null>(null);
  const [rangeMode, setRangeMode] = useState(false);
  const [rangeValues, setRangeValues] = useState({ x1: 60, x2: 80 });

  const handleCalculate = () => {
    const zResult = calculateZScore(input);
    setResult(zResult);
  };

  const generateNormalCurveData = () => {
    const { mean, stdDev } = input;
    const data = [];
    const start = mean - 4 * stdDev;
    const end = mean + 4 * stdDev;
    const step = (end - start) / 100;

    for (let x = start; x <= end; x += step) {
      const y = calculateNormalPDF({ mu: mean, sigma: stdDev }, x);
      data.push({
        x: x.toFixed(2),
        y: y,
        highlighted: rangeMode 
          ? (x >= rangeValues.x1 && x <= rangeValues.x2 ? y : 0)
          : (x <= input.value ? y : 0)
      });
    }

    return data;
  };

  const probabilityBetween = rangeMode 
    ? calculateProbabilityBetween(rangeValues.x1, rangeValues.x2, input.mean, input.stdDev)
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Z-Score Calculator & Normal Distribution
        </h2>
        <p className="text-gray-700">
          Tính Z-score, xác suất và percentile. Công cụ thiết yếu để chuẩn hóa dữ liệu và so sánh các biến.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Nhập dữ liệu
          </h3>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                checked={!rangeMode}
                onChange={() => setRangeMode(false)}
                className="mr-3 text-primary-600"
              />
              <div>
                <div className="font-medium text-gray-800">Single Value</div>
                <div className="text-xs text-gray-500">P(X ≤ value)</div>
              </div>
            </label>
            <label className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                checked={rangeMode}
                onChange={() => setRangeMode(true)}
                className="mr-3 text-primary-600"
              />
              <div>
                <div className="font-medium text-gray-800">Range</div>
                <div className="text-xs text-gray-500">P(x1 ≤ X ≤ x2)</div>
              </div>
            </label>
          </div>

          {/* Mean Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              μ (Mean)
              <Tooltip text="Trung bình của phân phối">
                <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={input.mean}
              onChange={(e) => setInput({ ...input, mean: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          {/* Std Dev Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              σ (Standard Deviation)
              <Tooltip text="Độ lệch chuẩn của phân phối">
                <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={input.stdDev}
              onChange={(e) => setInput({ ...input, stdDev: parseFloat(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              step="0.1"
              min="0.1"
            />
          </div>

          {!rangeMode ? (
            /* Single Value Input */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                X (Value)
                <Tooltip text="Giá trị cần tính Z-score">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={input.value}
                onChange={(e) => setInput({ ...input, value: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                step="0.1"
              />
            </div>
          ) : (
            /* Range Inputs */
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X₁ (Lower Bound)</label>
                <input
                  type="number"
                  value={rangeValues.x1}
                  onChange={(e) => setRangeValues({ ...rangeValues, x1: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X₂ (Upper Bound)</label>
                <input
                  type="number"
                  value={rangeValues.x2}
                  onChange={(e) => setRangeValues({ ...rangeValues, x2: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  step="0.1"
                />
              </div>
            </>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 px-4 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-md hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
          >
            🔍 Tính toán
          </button>

          {/* Formula Display */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">📐 Công thức:</h4>
            <div className="text-xs text-gray-700 space-y-1 font-mono">
              <p>Z = (X - μ) / σ</p>
              {!rangeMode && result && (
                <p className="text-primary-600">
                  Z = ({input.value} - {input.mean}) / {input.stdDev} = {result.zScore.toFixed(3)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visualization */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Normal Distribution Curve
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={generateNormalCurveData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip />
                <Area type="monotone" dataKey="y" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} />
                <Area type="monotone" dataKey="highlighted" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                {!rangeMode && (
                  <ReferenceLine x={input.value.toFixed(2)} stroke="#ef4444" strokeWidth={2}>
                    <Label value={`X = ${input.value}`} position="top" fill="#ef4444" />
                  </ReferenceLine>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Results Cards */}
          {result && !rangeMode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Z-Score */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-sm font-medium opacity-90 mb-1">Z-Score</div>
                <div className="text-3xl font-bold">{result.zScore.toFixed(3)}</div>
                <div className="text-xs opacity-80 mt-2">
                  {result.zScore > 0 ? `+${Math.abs(result.zScore).toFixed(2)}` : result.zScore.toFixed(2)} độ lệch chuẩn
                </div>
              </div>

              {/* Probability */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-sm font-medium opacity-90 mb-1">P(X ≤ {input.value})</div>
                <div className="text-3xl font-bold">{result.probability.toFixed(4)}</div>
                <div className="text-xs opacity-80 mt-2">
                  Xác suất ≤ {input.value}
                </div>
              </div>

              {/* Percentile */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-sm font-medium opacity-90 mb-1">Percentile</div>
                <div className="text-3xl font-bold">{result.percentile.toFixed(2)}%</div>
                <div className="text-xs opacity-80 mt-2">
                  Top {(100 - result.percentile).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {rangeMode && probabilityBetween !== null && (
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-8 rounded-lg shadow-lg">
              <div className="text-lg font-medium opacity-90 mb-2">
                P({rangeValues.x1} ≤ X ≤ {rangeValues.x2})
              </div>
              <div className="text-5xl font-bold mb-2">{probabilityBetween.toFixed(4)}</div>
              <div className="text-sm opacity-90">
                {(probabilityBetween * 100).toFixed(2)}% dữ liệu nằm trong khoảng này
              </div>
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-5 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">💡 Ứng dụng trong ML/AI:</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">🎯</span>
                <span><strong>Feature Scaling:</strong> StandardScaler trong sklearn sử dụng Z-score</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span><strong>Outlier Detection:</strong> |Z| &gt; 3 thường được coi là outlier</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⚖️</span>
                <span><strong>Normalization:</strong> Đưa features về cùng scale cho Neural Networks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔬</span>
                <span><strong>Hypothesis Testing:</strong> So sánh giá trị quan sát với expected</span>
              </li>
            </ul>
          </div>

          {/* 68-95-99.7 Rule */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">📏 Quy tắc 68-95-99.7 (Empirical Rule)</h4>
            <div className="space-y-2">
              {[
                { range: '[μ - σ, μ + σ]', percent: 68, color: 'blue', values: [input.mean - input.stdDev, input.mean + input.stdDev] },
                { range: '[μ - 2σ, μ + 2σ]', percent: 95, color: 'green', values: [input.mean - 2*input.stdDev, input.mean + 2*input.stdDev] },
                { range: '[μ - 3σ, μ + 3σ]', percent: 99.7, color: 'purple', values: [input.mean - 3*input.stdDev, input.mean + 3*input.stdDev] }
              ].map((rule, idx) => (
                <div key={idx} className={`p-3 rounded-lg bg-${rule.color}-50 border border-${rule.color}-200`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{rule.range}</span>
                    <span className={`text-lg font-bold text-${rule.color}-600`}>{rule.percent}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    [{rule.values[0].toFixed(2)}, {rule.values[1].toFixed(2)}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZScoreCalculator;

