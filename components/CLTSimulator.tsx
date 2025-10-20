import React, { useState } from 'react';
import { CLTParams, CLTResult } from '../types';
import { simulateCLT, calculateMean, calculateStdDev, generateHistogramBins, calculateNormalPDF } from '../services/simulationService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

const CLTSimulator: React.FC = () => {
  const [params, setParams] = useState<CLTParams>({
    populationMean: 100,
    populationStdDev: 15,
    sampleSize: 30,
    numSamples: 500,
    populationType: 'uniform'
  });

  const [result, setResult] = useState<CLTResult | null>(null);

  const runSimulation = () => {
    const cltResult = simulateCLT(params);
    setResult(cltResult);
  };

  const prepareChartData = () => {
    if (!result) return [];

    // Create histogram of sample means
    const bins = generateHistogramBins(result.sampleMeans, 30);
    
    // Calculate theoretical normal distribution
    const chartData = bins.map(bin => {
      const x = (bin.start + bin.end) / 2;
      const binWidth = bin.end - bin.start;
      const theoretical = calculateNormalPDF(
        { mu: result.theoreticalMean, sigma: result.theoreticalStdError },
        x
      ) * binWidth;

      return {
        x: x.toFixed(2),
        frequency: bin.frequency,
        theoretical: theoretical,
      };
    });

    return chartData;
  };

  const preparePopulationData = () => {
    if (!result) return [];
    
    const bins = generateHistogramBins(result.populationData, 30);
    return bins.map(bin => ({
      x: ((bin.start + bin.end) / 2).toFixed(2),
      frequency: bin.frequency
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧮 Central Limit Theorem (CLT) Simulator
        </h2>
        <p className="text-gray-700">
          Khám phá định lý quan trọng nhất trong thống kê: Dù phân phối gốc như thế nào, 
          <strong> trung bình mẫu sẽ luôn tiến đến phân phối chuẩn</strong> khi n đủ lớn!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Tham số mô phỏng
          </h3>

          {/* Population Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              Loại phân phối gốc
              <Tooltip text="Chọn phân phối của tổng thể. CLT sẽ hoạt động bất kể phân phối gốc!">
                <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
              </Tooltip>
            </label>
            <div className="space-y-2">
              {[
                { value: 'uniform', label: 'Uniform (Đều)', desc: 'Phân phối đều' },
                { value: 'exponential', label: 'Exponential', desc: 'Lệch phải' },
                { value: 'skewed', label: 'Skewed', desc: 'Lệch mạnh' }
              ].map(option => (
                <label key={option.value} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="populationType"
                    value={option.value}
                    checked={params.populationType === option.value}
                    onChange={(e) => setParams({ ...params, populationType: e.target.value as any })}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Population Mean */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                μ (Population Mean)
                <Tooltip text="Trung bình của tổng thể">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <span className="text-sm font-semibold text-primary-600">{params.populationMean}</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={params.populationMean}
              onChange={(e) => setParams({ ...params, populationMean: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          {/* Population StdDev */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                σ (Population Std Dev)
                <Tooltip text="Độ lệch chuẩn của tổng thể">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <span className="text-sm font-semibold text-primary-600">{params.populationStdDev}</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={params.populationStdDev}
              onChange={(e) => setParams({ ...params, populationStdDev: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          {/* Sample Size */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                n (Sample Size)
                <Tooltip text="Số phần tử trong mỗi mẫu. CLT hoạt động tốt khi n ≥ 30">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={params.sampleSize}
                onChange={(e) => setParams({ ...params, sampleSize: parseInt(e.target.value) || 5 })}
                className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md"
              />
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={params.sampleSize}
              onChange={(e) => setParams({ ...params, sampleSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          {/* Number of Samples */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Số mẫu lấy
                <Tooltip text="Số lần lấy mẫu để tính trung bình">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <span className="text-sm font-semibold text-primary-600">{params.numSamples}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={params.numSamples}
              onChange={(e) => setParams({ ...params, numSamples: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          <button
            onClick={runSimulation}
            className="w-full py-3 px-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            🚀 Chạy mô phỏng CLT
          </button>

          {/* CLT Formula */}
          {result && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">📐 Công thức CLT:</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-mono">X̄ ~ N(μ, σ/√n)</p>
                <p className="font-mono">
                  X̄ ~ N({result.theoreticalMean.toFixed(2)}, {result.theoreticalStdError.toFixed(2)})
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  <strong>SE = σ/√n</strong> = {params.populationStdDev}/√{params.sampleSize} = {result.theoreticalStdError.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              {/* Sample Means Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📊 Phân phối của Trung bình mẫu (Sample Means)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" label={{ value: 'Sample Mean', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#3b82f6" name="Empirical" opacity={0.7} />
                    <Line type="monotone" dataKey="theoretical" stroke="#f59e0b" strokeWidth={3} name="Theoretical Normal" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600">Mean của Sample Means:</p>
                    <p className="text-lg font-bold text-blue-600">
                      {calculateMean(result.sampleMeans).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600">Std Dev (Standard Error):</p>
                    <p className="text-lg font-bold text-purple-600">
                      {calculateStdDev(result.sampleMeans).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600">Theoretical Mean:</p>
                    <p className="text-lg font-bold text-green-600">
                      {result.theoreticalMean.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600">Theoretical SE:</p>
                    <p className="text-lg font-bold text-orange-600">
                      {result.theoreticalStdError.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Population Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📉 Phân phối gốc của Tổng thể (Population)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={preparePopulationData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="frequency" fill="#8b5cf6" name="Population Distribution" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-3 text-sm text-gray-600 text-center">
                  ⚠️ Lưu ý: Phân phối gốc <strong>KHÔNG cần phải chuẩn</strong> - CLT vẫn hoạt động!
                </p>
              </div>

              {/* Educational Note */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Ý nghĩa:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Sample means tạo thành <strong>phân phối chuẩn</strong> (hình chuông)</li>
                  <li>✅ Dù population distribution lệch/không chuẩn</li>
                  <li>✅ Mean của sample means ≈ μ (population mean)</li>
                  <li>✅ Standard Error = σ/√n giảm khi n tăng</li>
                  <li>🎯 <strong>Ứng dụng ML:</strong> Gradient descent, Bootstrap, Ensemble learning</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có dữ liệu
              </h3>
              <p className="text-gray-500">
                Nhấn "Chạy mô phỏng CLT" để bắt đầu khám phá định lý quan trọng nhất trong thống kê!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CLTSimulator;

