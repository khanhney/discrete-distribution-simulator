
import { BernoulliParams, BinomialParams, PoissonParams } from '../types';

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
        default: return 0;
    }
}
