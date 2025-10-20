import React, { useState, useCallback } from 'react';
import { ContinuousDistribution, NormalParams, TDistributionParams, ContinuousParams, ContinuousChartDataPoint } from '../types';
import { 
  generateNormal, 
  generateTDistribution, 
  calculateNormalPDF, 
  calculateTDistributionPDF,
  generateHistogramBins,
  calculateMean,
  calculateStdDev
} from '../services/simulationService';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';
import ContinuousEducationalPanel from './ContinuousEducationalPanel';

const DEFAULT_PARAMS = {
  [ContinuousDistribution.Normal]: { mu: 0, sigma: 1 },
  [ContinuousDistribution.TDistribution]: { df: 10, mu: 0, sigma: 1 },
};

const ContinuousDistributions: React.FC = () => {
  const [distribution, setDistribution] = useState<ContinuousDistribution>(ContinuousDistribution.Normal);
  const [params, setParams] = useState<ContinuousParams>(DEFAULT_PARAMS[ContinuousDistribution.Normal]);
  const [simulationData, setSimulationData] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ContinuousChartDataPoint[]>([]);
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true);

  const handleDistributionChange = (newDist: ContinuousDistribution) => {
    setDistribution(newDist);
    setParams(DEFAULT_PARAMS[newDist]);
    setSimulationData([]);
    setChartData([]);
  };

  const runSimulation = useCallback(() => {
    let rawData: number[] = [];
    
    switch (distribution) {
      case ContinuousDistribution.Normal:
        rawData = generateNormal(params as NormalParams);
        break;
      case ContinuousDistribution.TDistribution:
        rawData = generateTDistribution(params as TDistributionParams);
        break;
    }
    
    setSimulationData(rawData);

    // Create histogram bins
    const bins = generateHistogramBins(rawData, 40);
    
    // Create chart data with theoretical PDF
    const newChartData: ContinuousChartDataPoint[] = bins.map(bin => {
      const x = (bin.start + bin.end) / 2;
      const binWidth = bin.end - bin.start;
      
      let theoretical = 0;
      if (distribution === ContinuousDistribution.Normal) {
        theoretical = calculateNormalPDF(params as NormalParams, x) * binWidth;
      } else if (distribution === ContinuousDistribution.TDistribution) {
        theoretical = calculateTDistributionPDF(params as TDistributionParams, x) * binWidth;
      }
      
      return {
        x: parseFloat(x.toFixed(2)),
        frequency: bin.frequency,
        theoretical: theoretical
      };
    });

    setChartData(newChartData);
  }, [distribution, params]);

  const renderParams = () => {
    switch(distribution) {
      case ContinuousDistribution.Normal:
        const normalParams = params as NormalParams;
        return (
          <>
            {/* Mu */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  μ (Mean)
                  <Tooltip text="Trung bình của phân phối - điểm trung tâm của đường cong">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={normalParams.mu}
                  onChange={(e) => setParams({ ...normalParams, mu: parseFloat(e.target.value) || 0 })}
                  className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md"
                  step="0.5"
                />
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={normalParams.mu}
                onChange={(e) => setParams({ ...normalParams, mu: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            {/* Sigma */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  σ (Std Dev)
                  <Tooltip text="Độ lệch chuẩn - độ rộng của đường cong">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                  </Tooltip>
                </label>
                <span className="text-sm font-semibold text-primary-600">{normalParams.sigma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={normalParams.sigma}
                onChange={(e) => setParams({ ...normalParams, sigma: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </>
        );

      case ContinuousDistribution.TDistribution:
        const tParams = params as TDistributionParams;
        return (
          <>
            {/* Degrees of Freedom */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  df (Degrees of Freedom)
                  <Tooltip text="Bậc tự do. df càng lớn thì t-distribution càng gần với normal distribution">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={tParams.df}
                  onChange={(e) => setParams({ ...tParams, df: parseInt(e.target.value) || 1 })}
                  className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md"
                  min="1"
                  max="100"
                />
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={tParams.df}
                onChange={(e) => setParams({ ...tParams, df: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            {/* Mu */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  μ (Location)
                  <Tooltip text="Vị trí trung tâm của phân phối">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={tParams.mu}
                  onChange={(e) => setParams({ ...tParams, mu: parseFloat(e.target.value) || 0 })}
                  className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md"
                  step="0.5"
                />
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={tParams.mu}
                onChange={(e) => setParams({ ...tParams, mu: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            {/* Sigma */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  σ (Scale)
                  <Tooltip text="Tham số scale của phân phối">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                  </Tooltip>
                </label>
                <span className="text-sm font-semibold text-primary-600">{tParams.sigma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={tParams.sigma}
                onChange={(e) => setParams({ ...tParams, sigma: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getDistributionInfo = () => {
    switch(distribution) {
      case ContinuousDistribution.Normal:
        return {
          title: 'Normal (Gaussian) Distribution',
          formula: 'f(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))',
          useCase: 'Mô tả nhiều hiện tượng tự nhiên, cơ sở cho CLT',
          mlApplications: [
            'Feature Scaling (StandardScaler)',
            'Weight Initialization (Xavier/He)',
            'Gaussian Naive Bayes',
            'Gaussian Mixture Models',
            'Variational Autoencoders'
          ]
        };
      case ContinuousDistribution.TDistribution:
        return {
          title: 'Student\'s t-Distribution',
          formula: 't-distribution PDF với df degrees of freedom',
          useCase: 'Dùng khi cỡ mẫu nhỏ (n < 30) hoặc không biết σ',
          mlApplications: [
            'Confidence Intervals với small samples',
            'Hypothesis Testing (t-tests)',
            'Robust regression',
            'Bayesian inference'
          ]
        };
      default:
        return { title: '', formula: '', useCase: '', mlApplications: [] };
    }
  };

  const info = getDistributionInfo();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📈 Phân phối Liên tục (Continuous Distributions)
        </h2>
        <p className="text-gray-700">
          Khám phá Normal và t-Distribution - nền tảng của thống kê và machine learning!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Controls</h3>

          {/* Distribution Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Select Distribution
            </label>
            <div className="space-y-2">
              {Object.values(ContinuousDistribution).map((dist) => (
                <button
                  key={dist}
                  onClick={() => handleDistributionChange(dist)}
                  className={`w-full py-3 px-4 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    distribution === dist
                      ? 'bg-primary-600 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {dist === 'normal' ? '📊 Normal' : '📉 t-Distribution'}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Set Parameters
            </label>
            <div className="p-4 bg-gray-50 rounded-md border space-y-4">
              {renderParams()}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={runSimulation}
              className="w-full py-2.5 px-4 text-base font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm"
            >
              Run Simulation
            </button>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Show Theoretical PDF
                <Tooltip text="Hiển thị hàm mật độ xác suất lý thuyết">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showTheoretical}
                  onChange={(e) => setShowTheoretical(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          {simulationData.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">📊 Thống kê mẫu:</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <p><strong>Sample Mean:</strong> {calculateMean(simulationData).toFixed(3)}</p>
                <p><strong>Sample Std Dev:</strong> {calculateStdDev(simulationData).toFixed(3)}</p>
                <p><strong>Sample Size:</strong> {simulationData.length}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {simulationData.length > 0 ? (
            <>
              {/* Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{info.title}</h3>
                  <button
                    onClick={runSimulation}
                    className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#8b5cf6" name="Empirical" opacity={0.7} />
                    {showTheoretical && (
                      <Line type="monotone" dataKey="theoretical" stroke="#f59e0b" strokeWidth={3} name="Theoretical PDF" dot={false} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Distribution Info */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">📐 Formula:</h4>
                <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-700 mb-4">
                  {info.formula}
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">🎯 Use Case:</h4>
                <p className="text-sm text-gray-700 mb-4">{info.useCase}</p>

                <h4 className="font-semibold text-gray-800 mb-2">🤖 ML/AI Applications:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {info.mlApplications.map((app, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có dữ liệu
              </h3>
              <p className="text-gray-500">
                Chọn phân phối và nhấn "Run Simulation" để bắt đầu!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Panel */}
      <div className="mt-6">
        <ContinuousEducationalPanel distribution={distribution} />
      </div>
    </div>
  );
};

export default ContinuousDistributions;

