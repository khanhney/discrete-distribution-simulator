import React, { useState, useEffect } from 'react';
import { Distribution, AppParams, BernoulliParams, BinomialParams, PoissonParams } from '../types';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

interface ControlPanelProps {
  distribution: Distribution;
  setDistribution: (dist: Distribution) => void;
  params: AppParams;
  setParams: React.Dispatch<React.SetStateAction<AppParams>>;
  runSimulation: () => void;
  showTheoretical: boolean;
  setShowTheoretical: (show: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  distribution,
  setDistribution,
  params,
  setParams,
  runSimulation,
  showTheoretical,
  setShowTheoretical,
}) => {
  const [nInputValue, setNInputValue] = useState('10');
  const [lambdaInputValue, setLambdaInputValue] = useState('4');

  useEffect(() => {
    if (distribution === Distribution.Binomial) {
      setNInputValue(String((params as BinomialParams).n));
    }
    if (distribution === Distribution.Poisson) {
      setLambdaInputValue(String((params as PoissonParams).lambda));
    }
  }, [params, distribution]);

  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNInputValue(value);
    const parsedN = parseInt(value, 10);
    if (!isNaN(parsedN) && parsedN >= 1 && parsedN <= 100) {
      setParams(prev => ({ ...(prev as BinomialParams), n: parsedN }));
    }
  };

  const handleNBlur = () => {
    const parsedN = parseInt(nInputValue, 10);
    if (isNaN(parsedN) || parsedN < 1 || parsedN > 100) {
      setNInputValue(String((params as BinomialParams).n));
    }
  };

  const handleLambdaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLambdaInputValue(value);
    const parsedLambda = parseFloat(value);
    if (!isNaN(parsedLambda) && parsedLambda >= 0.1 && parsedLambda <= 20) {
      setParams(prev => ({ ...(prev as PoissonParams), lambda: parsedLambda }));
    }
  };

  const handleLambdaBlur = () => {
    const parsedLambda = parseFloat(lambdaInputValue);
    if (isNaN(parsedLambda) || parsedLambda < 0.1 || parsedLambda > 20) {
      setLambdaInputValue(String((params as PoissonParams).lambda));
    }
  };
  
  const renderParams = () => {
    switch(distribution) {
      case Distribution.Bernoulli:
        const bernoulliParams = params as BernoulliParams;
        return (
            <>
                <div className="flex items-center justify-between">
                    <label htmlFor="p" className="text-sm font-medium text-gray-600 flex items-center">
                    p (Probability)
                    <Tooltip text="The probability of success (outcome=1) in a single trial.">
                        <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                    </Tooltip>
                    </label>
                    <span className="text-sm font-semibold text-primary-600">{bernoulliParams.p.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    id="p"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={bernoulliParams.p}
                    onChange={(e) => setParams({ p: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
            </>
        );
      case Distribution.Binomial:
        const binomialParams = params as BinomialParams;
        return (
          <>
            <div className="flex items-center justify-between">
                <label htmlFor="n" className="text-sm font-medium text-gray-600 flex items-center">
                n (Trials)
                <Tooltip text="The total number of independent trials.">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
                </label>
                <input
                type="number"
                id="n"
                min="1"
                max="100"
                value={nInputValue}
                onChange={handleNChange}
                onBlur={handleNBlur}
                className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="p" className="text-sm font-medium text-gray-600 flex items-center">
                p (Probability)
                <Tooltip text="The probability of success for each individual trial.">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
                </label>
                <span className="text-sm font-semibold text-primary-600">{binomialParams.p.toFixed(2)}</span>
            </div>
            <input
                type="range"
                id="p"
                min="0.01"
                max="0.99"
                step="0.01"
                value={binomialParams.p}
                onChange={(e) => setParams({ ...binomialParams, p: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </>
        );
      case Distribution.Poisson:
        const poissonParams = params as PoissonParams;
         return (
          <>
            <div className="flex items-center justify-between">
                <label htmlFor="lambda" className="text-sm font-medium text-gray-600 flex items-center">
                λ (Lambda)
                <Tooltip text="The average rate of events occurring in a fixed interval of time or space.">
                    <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </Tooltip>
                </label>
                <input
                type="number"
                id="lambda"
                min="0.1"
                max="20"
                step="0.1"
                value={lambdaInputValue}
                onChange={handleLambdaChange}
                onBlur={handleLambdaBlur}
                className="w-20 text-center text-sm font-semibold text-primary-600 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
            </div>
            <input
              type="range"
              id="lambda-range"
              min="0.1"
              max="20"
              step="0.1"
              value={poissonParams.lambda}
              onChange={(e) => setParams({ ...poissonParams, lambda: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-dark-text mb-4 border-b pb-3">Controls</h2>
  
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          1. Select a Distribution
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.values(Distribution).map((dist) => (
            <button
              key={dist}
              onClick={() => setDistribution(dist)}
              className={`py-2 px-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                distribution === dist
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {dist.charAt(0).toUpperCase() + dist.slice(1)}
            </button>
          ))}
        </div>
      </div>
  
      <div className="mb-6">
         <label className="block text-sm font-medium text-gray-700 mb-2">
          2. Set Parameters
        </label>
        <div className="p-4 bg-gray-50 rounded-md border space-y-4">
          {renderParams()}
        </div>
      </div>
  
      <div className="space-y-4">
        <button
          onClick={runSimulation}
          className="w-full py-2.5 px-4 text-base font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
        >
          Run Simulation
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-md border gap-3 sm:gap-2">
          <label htmlFor="show-theoretical" className="text-sm font-medium text-gray-700 flex items-center">
              Show Theoretical PMF
              <Tooltip text="Overlay the theoretical Probability Mass Function (line) on the bar chart to compare simulation results with the exact mathematical distribution.">
                  <InfoIcon className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
              </Tooltip>
          </label>
          <div className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" id="show-theoretical" className="sr-only peer" checked={showTheoretical} onChange={(e) => setShowTheoretical(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;