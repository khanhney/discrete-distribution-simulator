import React, { useState, useEffect, useCallback } from 'react';
import { DistributionType, DiscreteDistribution, AppParams, ChartDataPoint, BernoulliParams, BinomialParams, PoissonParams } from './types';
import Navigation from './components/Navigation';
import ControlPanel from './components/ControlPanel';
import SimulationChart from './components/SimulationChart';
import ResultsPanel from './components/ResultsPanel';
import ContinuousDistributions from './components/ContinuousDistributions';
import CLTSimulator from './components/CLTSimulator';
import ZScoreCalculator from './components/ZScoreCalculator';
import ToolsSection from './components/ToolsSection';
import LearningPathGuide from './components/LearningPathGuide';
import DiscreteEducationalPanel from './components/DiscreteEducationalPanel';
import { 
  generateBernoulli, generateBinomial, generatePoisson, 
  calculateBernoulliPMF, calculateBinomialPMF, calculatePoissonPMF,
  getExpectedValue, getVariance
} from './services/simulationService';

const DEFAULT_PARAMS = {
  [DiscreteDistribution.Bernoulli]: { p: 0.5 },
  [DiscreteDistribution.Binomial]: { n: 10, p: 0.5 },
  [DiscreteDistribution.Poisson]: { lambda: 4 },
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DistributionType>(DistributionType.Discrete);
  
  // Discrete distribution states
  const [distribution, setDistribution] = useState<DiscreteDistribution>(DiscreteDistribution.Binomial);
  const [params, setParams] = useState<AppParams>(DEFAULT_PARAMS[DiscreteDistribution.Binomial]);
  const [simulationData, setSimulationData] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true);
  const [simulationKey, setSimulationKey] = useState<number>(0);

  const handleDistributionChange = (newDist: DiscreteDistribution) => {
    setDistribution(newDist);
    setParams(DEFAULT_PARAMS[newDist]);
    setSimulationData([]);
    setChartData([]);
  };

  const handleLoadExample = (exampleParams: AppParams) => {
    setParams(exampleParams);
    // Auto run simulation after loading example
    setTimeout(() => {
      runSimulation();
      setSimulationKey(k => k + 1);
    }, 100);
  };

  const runSimulation = useCallback(() => {
    let rawData: number[] = [];
    let pmfCalculator: (params: any, k: number) => number;
    
    switch (distribution) {
      case DiscreteDistribution.Bernoulli:
        rawData = generateBernoulli(params as BernoulliParams);
        pmfCalculator = (p, k) => calculateBernoulliPMF(p as BernoulliParams, k);
        break;
      case DiscreteDistribution.Binomial:
        rawData = generateBinomial(params as BinomialParams);
        pmfCalculator = (p, k) => calculateBinomialPMF(p as BinomialParams, k);
        break;
      case DiscreteDistribution.Poisson:
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

  const renderContent = () => {
    switch (activeSection) {
      case DistributionType.Discrete:
        return (
          <>
            <div className="bg-primary-50 border-l-4 border-primary-500 text-primary-800 p-3 sm:p-4 rounded-md mb-4 sm:mb-8 shadow-sm" role="alert">
              <p className="font-bold text-sm sm:text-base mb-1">🎲 Discrete Probability</p>
              <p className="text-xs sm:text-sm">In AI and Machine Learning, we deal with uncertainty, not certainty. Understanding these distributions is the first step to modeling randomness in data.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
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
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-dark-text">Simulation Results</h2>
                    {simulationData.length > 0 && 
                      <button 
                        onClick={() => setSimulationKey(k => k + 1)}
                        className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            
            {/* Educational Panel */}
            <div className="mt-8">
              <DiscreteEducationalPanel 
                distribution={distribution}
                params={params}
                onLoadExample={handleLoadExample}
              />
            </div>
          </>
        );
      
      case DistributionType.Continuous:
        return (
          <>
            <ContinuousDistributions />
            <div className="mt-8">
              <ZScoreCalculator />
            </div>
          </>
        );
      
      case DistributionType.CLT:
        return <CLTSimulator />;
      
      case DistributionType.Tools:
        return (
          <>
            <ToolsSection />
            <div className="mt-8">
              <LearningPathGuide />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg font-sans pb-20 sm:pb-0">
      <header className="bg-white shadow-sm pt-0 sm:pt-16">
        <div className="max-w-7xl mx-auto py-3 sm:py-5 px-3 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-text leading-tight">
            Probability & Statistics Simulator 🎲
          </h1>
          <p className="text-light-text mt-1 text-xs sm:text-sm">
            Interactive Learning Tool for Probability & Statistics - Foundation for AI/ML
          </p>
        </div>
      </header>
      
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16 mb-0 sm:mb-0">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-6 lg:px-8 pb-20 sm:pb-8">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm sm:text-base">
              Made with ❤️ for ML/AI learners
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Understanding probability = Understanding how AI learns and makes decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
