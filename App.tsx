import React, { useState, useEffect, useCallback } from 'react';
import { Distribution, AppParams, ChartDataPoint, BernoulliParams, BinomialParams, PoissonParams } from './types';
import ControlPanel from './components/ControlPanel';
import SimulationChart from './components/SimulationChart';
import ResultsPanel from './components/ResultsPanel';
import { 
  generateBernoulli, generateBinomial, generatePoisson, 
  calculateBernoulliPMF, calculateBinomialPMF, calculatePoissonPMF,
  getExpectedValue, getVariance
} from './services/simulationService';

const DEFAULT_PARAMS = {
  [Distribution.Bernoulli]: { p: 0.5 },
  [Distribution.Binomial]: { n: 10, p: 0.5 },
  [Distribution.Poisson]: { lambda: 4 },
};

const App: React.FC = () => {
  const [distribution, setDistribution] = useState<Distribution>(Distribution.Binomial);
  const [params, setParams] = useState<AppParams>(DEFAULT_PARAMS[Distribution.Binomial]);
  const [simulationData, setSimulationData] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true);
  const [simulationKey, setSimulationKey] = useState<number>(0);

  const handleDistributionChange = (newDist: Distribution) => {
    setDistribution(newDist);
    setParams(DEFAULT_PARAMS[newDist]);
    setSimulationData([]);
    setChartData([]);
  };

  const runSimulation = useCallback(() => {
    let rawData: number[] = [];
    let pmfCalculator: (params: any, k: number) => number;
    
    switch (distribution) {
      case Distribution.Bernoulli:
        rawData = generateBernoulli(params as BernoulliParams);
        pmfCalculator = (p, k) => calculateBernoulliPMF(p as BernoulliParams, k);
        break;
      case Distribution.Binomial:
        rawData = generateBinomial(params as BinomialParams);
        pmfCalculator = (p, k) => calculateBinomialPMF(p as BinomialParams, k);
        break;
      case Distribution.Poisson:
        rawData = generatePoisson(params as PoissonParams);
        pmfCalculator = (p, k) => calculatePoissonPMF(p as PoissonParams, k);
        break;
    }
    
    setSimulationData(rawData);

    const frequencies: { [key: number]: number } = {};
    rawData.forEach(val => {
      frequencies[val] = (frequencies[val] || 0) + 1;
    });

    const maxK = Math.max(...Object.keys(frequencies).map(Number), (distribution === 'binomial' ? (params as BinomialParams).n : 0));
    const rangeMax = distribution === 'poisson' ? Math.max(20, maxK + 5) : (distribution === 'binomial' ? (params as BinomialParams).n : 1);
    
    const newChartData: ChartDataPoint[] = [];
    for (let k = 0; k <= rangeMax; k++) {
      newChartData.push({
        k: k,
        frequency: (frequencies[k] || 0) / rawData.length,
        theoretical: pmfCalculator(params, k),
      });
    }

    setChartData(newChartData);
  }, [distribution, params]);
  
  useEffect(() => {
    if(simulationKey > 0) {
      runSimulation();
    }
  }, [simulationKey]);

  return (
    <div className="min-h-screen bg-light-bg font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text">
            Discrete Distribution Simulator
          </h1>
          <p className="text-light-text mt-1 text-sm sm:text-base">
            An Interactive Guide to the Probabilistic Foundations of AI
          </p>
        </div>
      </header>
      <main className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-50 border-l-4 border-primary-500 text-primary-800 p-4 rounded-md mb-6 md:mb-8 shadow-sm" role="alert">
                <p className="font-bold">Welcome to the Probability Simulator!</p>
                <p className="text-sm sm:text-base">In AI and Machine Learning, we deal with uncertainty, not certainty. Understanding these distributions is the first step to modeling the randomness in data, which allows us to build intelligent predictive models. Let's explore!</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-1">
                    <ControlPanel
                    distribution={distribution}
                    setDistribution={handleDistributionChange}
                    params={params}
                    setParams={setParams}
                    runSimulation={() => { runSimulation(); setSimulationKey(k => k + 1); }}
                    showTheoretical={showTheoretical}
                    setShowTheoretical={setShowTheoretical}
                    />
                </div>
                <div className="lg:col-span-2">
                    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3 sm:gap-2">
                        <h2 className="text-xl font-semibold text-dark-text">Simulation Results</h2>
                        {simulationData.length > 0 && 
                            <button 
                                onClick={() => setSimulationKey(k => k + 1)}
                                className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 self-start sm:self-center"
                            >
                            Try Again
                            </button>
                        }
                        </div>
                    <SimulationChart data={chartData} showTheoretical={showTheoretical} />
                    <ResultsPanel 
                        simulationData={simulationData}
                        chartData={chartData}
                        expectedValue={getExpectedValue(distribution, params)}
                        variance={getVariance(distribution, params)}
                        distribution={distribution}
                        params={params}
                    />
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;