
import { 
  BernoulliParams, BinomialParams, PoissonParams,
  NormalParams, TDistributionParams, CLTParams, CLTResult,
  ZScoreInput, ZScoreResult, CorrelationData
} from '../types';

const SIMULATION_SIZE = 1000;

// --- Helper Functions ---
const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return res;
};


// --- Simulation Data Generators ---
export const generateBernoulli = (params: BernoulliParams): number[] => {
  const { p } = params;
  const data: number[] = [];
  for (let i = 0; i < SIMULATION_SIZE; i++) {
    data.push(Math.random() < p ? 1 : 0);
  }
  return data;
};

export const generateBinomial = (params: BinomialParams): number[] => {
  const { n, p } = params;
  const data: number[] = [];
  for (let i = 0; i < SIMULATION_SIZE; i++) {
    let successes = 0;
    for (let j = 0; j < n; j++) {
      if (Math.random() < p) {
        successes++;
      }
    }
    data.push(successes);
  }
  return data;
};

export const generatePoisson = (params: PoissonParams): number[] => {
  const { lambda } = params;
  const data: number[] = [];
  const L = Math.exp(-lambda);
  for (let i = 0; i < SIMULATION_SIZE; i++) {
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    data.push(k - 1);
  }
  return data;
};


// --- Probability Mass Function (PMF) Calculators ---
export const calculateBernoulliPMF = (params: BernoulliParams, k: number): number => {
  const { p } = params;
  if (k === 0) return 1 - p;
  if (k === 1) return p;
  return 0;
};

export const calculateBinomialPMF = (params: BinomialParams, k: number): number => {
  const { n, p } = params;
  if (k < 0 || k > n) return 0;
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

export const calculatePoissonPMF = (params: PoissonParams, k: number): number => {
  const { lambda } = params;
  if (k < 0) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};


// --- Expected Value and Variance Calculators ---

export const getExpectedValue = (dist: string, params: any): number => {
    switch(dist) {
        case 'bernoulli': return params.p;
        case 'binomial': return params.n * params.p;
        case 'poisson': return params.lambda;
        default: return 0;
    }
}

export const getVariance = (dist: string, params: any): number => {
    switch(dist) {
        case 'bernoulli': return params.p * (1-params.p);
        case 'binomial': return params.n * params.p * (1-params.p);
        case 'poisson': return params.lambda;
        case 'normal': return params.sigma * params.sigma;
        case 't-distribution': return params.df > 2 ? (params.df / (params.df - 2)) * params.sigma * params.sigma : Infinity;
        default: return 0;
    }
}

// ============================================
// CONTINUOUS DISTRIBUTIONS
// ============================================

// Box-Muller transform to generate normal random variables
const boxMullerTransform = (): [number, number] => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
  return [z0, z1];
};

// Generate Normal distribution samples
export const generateNormal = (params: NormalParams, size: number = SIMULATION_SIZE): number[] => {
  const { mu, sigma } = params;
  const data: number[] = [];
  
  for (let i = 0; i < size / 2; i++) {
    const [z0, z1] = boxMullerTransform();
    data.push(mu + sigma * z0);
    if (data.length < size) {
      data.push(mu + sigma * z1);
    }
  }
  
  return data.slice(0, size);
};

// Normal PDF (Probability Density Function)
export const calculateNormalPDF = (params: NormalParams, x: number): number => {
  const { mu, sigma } = params;
  const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
  return coefficient * Math.exp(exponent);
};

// Standard Normal CDF approximation (for Z-scores)
export const standardNormalCDF = (z: number): number => {
  // Abramowitz and Stegun approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - p : p;
};

// Generate t-distribution samples using ratio of uniforms method
export const generateTDistribution = (params: TDistributionParams, size: number = SIMULATION_SIZE): number[] => {
  const { df, mu, sigma } = params;
  const data: number[] = [];
  
  for (let i = 0; i < size; i++) {
    // Generate standard normal
    const [z] = boxMullerTransform();
    
    // Generate chi-square with df degrees of freedom
    let chiSquare = 0;
    for (let j = 0; j < df; j++) {
      const [zj] = boxMullerTransform();
      chiSquare += zj * zj;
    }
    
    // t = Z / sqrt(chi-square / df)
    const t = z / Math.sqrt(chiSquare / df);
    data.push(mu + sigma * t);
  }
  
  return data;
};

// t-distribution PDF (simplified)
export const calculateTDistributionPDF = (params: TDistributionParams, x: number): number => {
  const { df, mu, sigma } = params;
  const standardized = (x - mu) / sigma;
  
  // Gamma function approximation for t-distribution
  const gammaNum = gamma((df + 1) / 2);
  const gammaDen = gamma(df / 2);
  const coefficient = gammaNum / (Math.sqrt(df * Math.PI) * gammaDen * sigma);
  const denominator = Math.pow(1 + (standardized * standardized) / df, (df + 1) / 2);
  
  return coefficient / denominator;
};

// Gamma function approximation (Stirling's approximation)
const gamma = (z: number): number => {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  
  z -= 1;
  const g = 7;
  const coef = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  let x = coef[0];
  for (let i = 1; i < g + 2; i++) {
    x += coef[i] / (z + i);
  }
  
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

// ============================================
// CENTRAL LIMIT THEOREM SIMULATOR
// ============================================

// Generate different population distributions
const generatePopulation = (type: 'uniform' | 'exponential' | 'skewed', mean: number, stdDev: number, size: number = 10000): number[] => {
  const data: number[] = [];
  
  switch (type) {
    case 'uniform':
      // Uniform distribution with given mean and stdDev
      // For uniform: mean = (a+b)/2, stdDev = (b-a)/sqrt(12)
      const range = stdDev * Math.sqrt(12);
      const a = mean - range / 2;
      const b = mean + range / 2;
      for (let i = 0; i < size; i++) {
        data.push(a + Math.random() * (b - a));
      }
      break;
      
    case 'exponential':
      // Exponential distribution
      // Transform to have desired mean
      const lambda = 1 / mean;
      for (let i = 0; i < size; i++) {
        data.push(-Math.log(Math.random()) / lambda);
      }
      break;
      
    case 'skewed':
      // Right-skewed distribution (using exponential mix)
      for (let i = 0; i < size; i++) {
        const u = Math.random();
        // Mix of exponentials to create skew
        const value = mean + stdDev * (-Math.log(u) - 1);
        data.push(value);
      }
      break;
  }
  
  return data;
};

// Central Limit Theorem Simulator
export const simulateCLT = (params: CLTParams): CLTResult => {
  const { populationMean, populationStdDev, sampleSize, numSamples, populationType } = params;
  
  // Generate population
  const population = generatePopulation(populationType, populationMean, populationStdDev);
  
  // Take multiple samples and compute means
  const sampleMeans: number[] = [];
  
  for (let i = 0; i < numSamples; i++) {
    let sum = 0;
    for (let j = 0; j < sampleSize; j++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      sum += population[randomIndex];
    }
    sampleMeans.push(sum / sampleSize);
  }
  
  // Theoretical values from CLT
  const theoreticalMean = populationMean;
  const theoreticalStdError = populationStdDev / Math.sqrt(sampleSize);
  
  return {
    sampleMeans,
    populationData: population.slice(0, 1000), // Return subset for visualization
    theoreticalMean,
    theoreticalStdError
  };
};

// ============================================
// Z-SCORE CALCULATOR
// ============================================

export const calculateZScore = (input: ZScoreInput): ZScoreResult => {
  const { value, mean, stdDev } = input;
  
  // Calculate Z-score
  const zScore = (value - mean) / stdDev;
  
  // Calculate probability P(X <= value)
  const probability = standardNormalCDF(zScore);
  
  // Percentile is just probability * 100
  const percentile = probability * 100;
  
  return {
    zScore,
    probability,
    percentile
  };
};

// Calculate probability between two values
export const calculateProbabilityBetween = (x1: number, x2: number, mean: number, stdDev: number): number => {
  const z1 = (x1 - mean) / stdDev;
  const z2 = (x2 - mean) / stdDev;
  
  return Math.abs(standardNormalCDF(z2) - standardNormalCDF(z1));
};

// ============================================
// STATISTICAL UTILITIES
// ============================================

// Calculate mean
export const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
};

// Calculate standard deviation
export const calculateStdDev = (data: number[]): number => {
  if (data.length === 0) return 0;
  const mean = calculateMean(data);
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  return Math.sqrt(variance);
};

// Calculate correlation coefficient
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);
  
  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    sumXSquared += diffX * diffX;
    sumYSquared += diffY * diffY;
  }
  
  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
};

// Generate histogram bins
export const generateHistogramBins = (data: number[], numBins: number = 20) => {
  if (data.length === 0) return [];
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / numBins;
  
  const bins = [];
  for (let i = 0; i < numBins; i++) {
    bins.push({
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth,
      count: 0,
      frequency: 0
    });
  }
  
  // Count data points in each bin
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
    if (binIndex >= 0 && binIndex < numBins) {
      bins[binIndex].count++;
    }
  });
  
  // Calculate frequencies
  bins.forEach(bin => {
    bin.frequency = bin.count / data.length;
  });
  
  return bins;
};
