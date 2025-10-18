import React, { useState, useEffect } from 'react';
import { ChartDataPoint, Distribution, AppParams } from '../types';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

interface ResultsPanelProps {
  simulationData: number[];
  chartData: ChartDataPoint[];
  expectedValue: number;
  variance: number;
  distribution: Distribution;
  params: AppParams;
}

const getEducationalContent = (distribution: Distribution, params: AppParams, expectedValue: number, simulationData: number[]) => {
    const observedMean = simulationData.reduce((a, b) => a + b, 0) / simulationData.length;

    const interpretation = `After ${simulationData.length} simulations, the observed average is ${observedMean.toFixed(3)}, which is very close to the theoretical expected value E(X) = ${expectedValue.toFixed(3)}. This demonstrates the Law of Large Numbers: as the number of trials increases, the sample average converges to the theoretical expectation.`;
    
    let relationships = '';
    let mlApplication = '';

    switch (distribution) {
        case Distribution.Bernoulli:
            mlApplication = 'In AI, the Bernoulli distribution is the cornerstone of models that predict binary outcomes (0/1, yes/no). For example, a Logistic Regression model for email classification outputs a probability "p" that a given email is spam. Each email is treated as a Bernoulli trial.';
            break;
        case Distribution.Binomial:
            relationships = 'Connection: When the number of trials "n" is large and the probability "p" is very small, the Binomial distribution can be approximated by the Poisson distribution with λ = n * p. Try setting n=50 and p=0.02 (so λ=1) and compare its shape to a Poisson(λ=1) distribution.';
            mlApplication = 'The Binomial distribution is crucial for evaluating classifier performance. If a model has 90% accuracy (p=0.9) and you test it on 10 new samples (n=10), this distribution tells you the probability of getting exactly 8, 9, or 10 correct predictions.';
            break;
        case Distribution.Poisson:
            relationships = 'Connection: When the average rate λ is large (typically λ > 20), the Poisson distribution can be approximated by the Normal (Gaussian) distribution. Try increasing λ and watch the histogram become more symmetric and bell-shaped.';
            mlApplication = 'Poisson is used to model count data in regression models (Poisson Regression). For example, predicting the number of bicycles rented from a station per hour, based on weather and time of day. It is essential when the target variable is a non-negative integer count.';
            break;
    }

    return { interpretation, relationships, mlApplication };
}

const StatCard: React.FC<{title: string, value: string, colorClass: string, tooltipText?: string}> = ({title, value, colorClass, tooltipText}) => (
    <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm text-gray-500">{title}</h4>
            {tooltipText && (
                <Tooltip text={tooltipText}>
                    <InfoIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                </Tooltip>
            )}
        </div>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

type Tab = 'interpretation' | 'relationships' | 'ml';

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  simulationData,
  chartData,
  expectedValue,
  variance,
  distribution,
  params,
}) => {
  const [visibleRows, setVisibleRows] = useState(10);
  const [activeTab, setActiveTab] = useState<Tab>('interpretation');

  useEffect(() => {
    setVisibleRows(10);
    setActiveTab('interpretation');
  }, [chartData]);
  
  if (simulationData.length === 0) {
    return null;
  }

  const observedMean = simulationData.reduce((a, b) => a + b, 0) / simulationData.length;
  const { interpretation, relationships, mlApplication } = getEducationalContent(distribution, params, expectedValue, simulationData);
  
  const allProbabilityTableData = chartData.filter(d => d.theoretical > 0.0001);
  const probabilityTableData = allProbabilityTableData.slice(0, visibleRows);

  const handleLoadMore = () => {
    setVisibleRows(20);
  };

  const TABS: { id: Tab; label: string; content: string; available: boolean }[] = [
    { id: 'interpretation', label: 'Interpretation', content: interpretation, available: !!interpretation },
    { id: 'relationships', label: 'Relationships', content: relationships, available: !!relationships },
    { id: 'ml', label: 'AI/ML Applications', content: mlApplication, available: !!mlApplication },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-dark-text border-b pb-2 mb-4">Key Statistics</h3>
        <div className="space-y-3">
           <StatCard 
              title="Theoretical E(X)" 
              value={expectedValue.toFixed(4)} 
              colorClass="text-primary-600"
              tooltipText="The long-run average value of a random variable. It's the theoretical 'center' of the distribution you'd expect from infinite trials."
            />
           <StatCard 
              title="Theoretical Var(X)" 
              value={variance.toFixed(4)} 
              colorClass="text-primary-600"
              tooltipText="Measures how spread out the data is from the expected value. Low variance means data is clustered tightly around the average; high variance means it's more spread out."
            />
           <StatCard 
              title="Observed Mean" 
              value={observedMean.toFixed(4)} 
              colorClass="text-green-600"
              tooltipText="The actual average calculated from our 1000 simulations. According to the Law of Large Numbers, this value gets closer to the theoretical E(X) as more simulations are run."
            />
        </div>
      </div>

      <div className="lg:col-span-3 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-dark-text border-b pb-2 mb-3">Probability Table P(X=k)</h3>
        <div className="overflow-x-auto max-h-60 custom-scrollbar">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-2">k</th>
                <th scope="col" className="px-4 py-2">Theoretical P(X=k)</th>
                <th scope="col" className="px-4 py-2">Observed Frequency</th>
              </tr>
            </thead>
            <tbody>
              {probabilityTableData.map(item => (
                <tr key={item.k} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-1.5 font-medium">{item.k}</td>
                  <td className="px-4 py-1.5">{(item.theoretical * 100).toFixed(2)}%</td>
                  <td className="px-4 py-1.5">{(item.frequency * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allProbabilityTableData.length > 10 && visibleRows < 20 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {TABS.filter(tab => tab.available).map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                            activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        <div className="pt-6">
            <p className="text-gray-700 leading-relaxed">
                {TABS.find(tab => tab.id === activeTab)?.content}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;