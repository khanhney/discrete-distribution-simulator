import React, { useState } from 'react';
import { calculateCorrelation, calculateMean, calculateStdDev, generateHistogramBins } from '../services/simulationService';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Cell } from 'recharts';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

const ToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'histogram' | 'correlation' | 'derived'>('histogram');

  // Histogram state
  const [histogramData, setHistogramData] = useState<string>('');
  const [histogramBins, setHistogramBins] = useState<number>(20);
  const [histogramResult, setHistogramResult] = useState<any>(null);

  // Correlation state
  const [xData, setXData] = useState<string>('');
  const [yData, setYData] = useState<string>('');
  const [correlationResult, setCorrelationResult] = useState<any>(null);

  // Derived metrics state
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [income, setIncome] = useState<number>(50000);

  const parseData = (text: string): number[] => {
    return text
      .split(/[,\s\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const handleHistogramAnalysis = () => {
    const data = parseData(histogramData);
    if (data.length === 0) {
      alert('Vui lòng nhập dữ liệu hợp lệ!');
      return;
    }

    const bins = generateHistogramBins(data, histogramBins);
    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data);

    setHistogramResult({
      bins,
      mean,
      stdDev,
      count: data.length,
      min: Math.min(...data),
      max: Math.max(...data)
    });
  };

  const handleCorrelationAnalysis = () => {
    const x = parseData(xData);
    const y = parseData(yData);

    if (x.length === 0 || y.length === 0) {
      alert('Vui lòng nhập dữ liệu cho cả X và Y!');
      return;
    }

    if (x.length !== y.length) {
      alert('X và Y phải có cùng số lượng phần tử!');
      return;
    }

    const correlation = calculateCorrelation(x, y);
    const scatterData = x.map((xi, i) => ({ x: xi, y: y[i] }));

    setCorrelationResult({
      correlation,
      scatterData,
      xMean: calculateMean(x),
      yMean: calculateMean(y),
      xStdDev: calculateStdDev(x),
      yStdDev: calculateStdDev(y)
    });
  };

  const calculateBMI = () => {
    const heightM = height / 100;
    return weight / (heightM * heightM);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'blue' };
    if (bmi < 25) return { text: 'Normal', color: 'green' };
    if (bmi < 30) return { text: 'Overweight', color: 'yellow' };
    return { text: 'Obese', color: 'red' };
  };

  const tabs = [
    { id: 'histogram', label: '📊 Histogram & Stats', icon: '📊' },
    { id: 'correlation', label: '📈 Correlation Analysis', icon: '📈' },
    { id: 'derived', label: '🧮 Derived Metrics', icon: '🧮' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🛠️ Công cụ Phân tích Dữ liệu (EDA Tools)
        </h2>
        <p className="text-gray-700">
          Các công cụ thiết yếu để khám phá và hiểu dữ liệu trước khi áp dụng Machine Learning
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'histogram' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Nhập dữ liệu
                <Tooltip text="Nhập các số, phân cách bằng dấu phẩy, khoảng trắng hoặc xuống dòng">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
              </h3>

              <textarea
                value={histogramData}
                onChange={(e) => setHistogramData(e.target.value)}
                placeholder="Ví dụ: 23, 45, 67, 89, 12, 34, 56, 78, 90, 45, 67, 89..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm font-mono"
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số bins: {histogramBins}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={histogramBins}
                  onChange={(e) => setHistogramBins(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              <button
                onClick={handleHistogramAnalysis}
                className="w-full mt-4 py-2.5 px-4 text-base font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors shadow-sm"
              >
                📊 Phân tích
              </button>

              {/* Quick Examples */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Ví dụ nhanh:</p>
                <button
                  onClick={() => setHistogramData('23,45,67,89,12,34,56,78,90,45,67,89,23,45,67,89,12,34,56,78')}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Tải dữ liệu mẫu
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {histogramResult ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả phân tích</h3>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600">Mean (μ)</p>
                      <p className="text-xl font-bold text-blue-600">{histogramResult.mean.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600">Std Dev (σ)</p>
                      <p className="text-xl font-bold text-purple-600">{histogramResult.stdDev.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600">Min</p>
                      <p className="text-xl font-bold text-green-600">{histogramResult.min.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600">Max</p>
                      <p className="text-xl font-bold text-orange-600">{histogramResult.max.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Histogram */}
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={histogramResult.bins.map((bin: any) => ({
                      range: `${bin.start.toFixed(1)}-${bin.end.toFixed(1)}`,
                      count: bin.count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="count" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-gray-700">
                    <strong>💡 Ứng dụng ML:</strong> Histogram giúp phát hiện outliers, 
                    hiểu phân phối dữ liệu, quyết định cách feature scaling.
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📊</div>
                  <p>Nhập dữ liệu và nhấn "Phân tích"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'correlation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nhập dữ liệu X và Y</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biến X
                </label>
                <textarea
                  value={xData}
                  onChange={(e) => setXData(e.target.value)}
                  placeholder="Ví dụ: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm font-mono"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biến Y
                </label>
                <textarea
                  value={yData}
                  onChange={(e) => setYData(e.target.value)}
                  placeholder="Ví dụ: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20"
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm font-mono"
                />
              </div>

              <button
                onClick={handleCorrelationAnalysis}
                className="w-full py-2.5 px-4 text-base font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors shadow-sm"
              >
                📈 Tính Correlation
              </button>

              {/* Examples */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-700">Ví dụ nhanh:</p>
                <button
                  onClick={() => {
                    setXData('1,2,3,4,5,6,7,8,9,10');
                    setYData('2,4,6,8,10,12,14,16,18,20');
                  }}
                  className="block text-xs text-primary-600 hover:underline"
                >
                  Tương quan dương (r ≈ 1)
                </button>
                <button
                  onClick={() => {
                    setXData('1,2,3,4,5,6,7,8,9,10');
                    setYData('10,9,8,7,6,5,4,3,2,1');
                  }}
                  className="block text-xs text-primary-600 hover:underline"
                >
                  Tương quan âm (r ≈ -1)
                </button>
                <button
                  onClick={() => {
                    setXData('1,2,3,4,5,6,7,8,9,10');
                    setYData('5,8,3,9,2,7,4,6,3,8');
                  }}
                  className="block text-xs text-primary-600 hover:underline"
                >
                  Không tương quan (r ≈ 0)
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {correlationResult ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả</h3>

                  {/* Correlation Value */}
                  <div className={`p-6 rounded-lg mb-4 ${
                    Math.abs(correlationResult.correlation) > 0.7 ? 'bg-green-100 border-green-500' :
                    Math.abs(correlationResult.correlation) > 0.3 ? 'bg-yellow-100 border-yellow-500' :
                    'bg-red-100 border-red-500'
                  } border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Correlation Coefficient (r)</p>
                    <p className="text-4xl font-bold text-gray-800">
                      {correlationResult.correlation.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {Math.abs(correlationResult.correlation) > 0.7 ? '🟢 Strong correlation' :
                       Math.abs(correlationResult.correlation) > 0.3 ? '🟡 Moderate correlation' :
                       '🔴 Weak/No correlation'}
                    </p>
                  </div>

                  {/* Scatter Plot */}
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottom', offset: -5 }} />
                      <YAxis dataKey="y" label={{ value: 'Y', angle: -90, position: 'insideLeft' }} />
                      <ChartTooltip />
                      <Scatter data={correlationResult.scatterData} fill="#06b6d4" />
                    </ScatterChart>
                  </ResponsiveContainer>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-2 bg-blue-50 rounded text-xs">
                      <p className="text-gray-600">X: μ={correlationResult.xMean.toFixed(2)}, σ={correlationResult.xStdDev.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-xs">
                      <p className="text-gray-600">Y: μ={correlationResult.yMean.toFixed(2)}, σ={correlationResult.yStdDev.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-gray-700">
                    <strong>💡 Ứng dụng ML:</strong> Correlation giúp feature selection, 
                    phát hiện multicollinearity, hiểu mối quan hệ giữa features.
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📈</div>
                  <p>Nhập X và Y để tính correlation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'derived' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tính toán Derived Metrics
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tạo features mới từ raw data - kỹ thuật quan trọng trong Feature Engineering
              </p>

              {/* Height */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Chiều cao (cm)</label>
                  <span className="text-sm font-semibold text-primary-600">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* Weight */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Cân nặng (kg)</label>
                  <span className="text-sm font-semibold text-primary-600">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* Age */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Tuổi</label>
                  <span className="text-sm font-semibold text-primary-600">{age}</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* Income */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Thu nhập ($)</label>
                  <span className="text-sm font-semibold text-primary-600">${income.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={income}
                  onChange={(e) => setIncome(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Derived Features</h3>

              {/* BMI */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">BMI (Body Mass Index)</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${getBMICategory(calculateBMI()).color}-500`}>
                    {getBMICategory(calculateBMI()).text}
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">{calculateBMI().toFixed(2)}</p>
                <p className="text-xs text-gray-600 font-mono">
                  BMI = weight / (height/100)² = {weight} / {(height/100).toFixed(2)}² = {calculateBMI().toFixed(2)}
                </p>
              </div>

              {/* Other Derived Metrics */}
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Income per Age Year</p>
                  <p className="text-xl font-bold text-green-600">
                    ${(income / age).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    = {income.toLocaleString()} / {age}
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">Weight Category Score</p>
                  <p className="text-xl font-bold text-purple-600">
                    {((weight / height) * 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    = ({weight} / {height}) × 100
                  </p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Log(Income)</p>
                  <p className="text-xl font-bold text-orange-600">
                    {Math.log10(income).toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Useful for right-skewed distributions
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-xs text-gray-700 border border-yellow-200">
                <strong>💡 Feature Engineering trong ML:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>✅ Tạo features có ý nghĩa từ raw data</li>
                  <li>✅ Giảm dimensionality nhưng giữ information</li>
                  <li>✅ Cải thiện model performance</li>
                  <li>✅ Ví dụ: BMI thay vì dùng riêng weight & height</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsSection;

