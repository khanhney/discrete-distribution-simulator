// Distribution Types
export enum DistributionType {
  Discrete = 'discrete',
  Continuous = 'continuous',
  CLT = 'clt',
  Tools = 'tools',
}

export enum DiscreteDistribution {
  Bernoulli = 'bernoulli',
  Binomial = 'binomial',
  Poisson = 'poisson',
}

export enum ContinuousDistribution {
  Normal = 'normal',
  TDistribution = 't-distribution',
}

export type Distribution = DiscreteDistribution | ContinuousDistribution;

// Discrete Distribution Parameters
export interface BernoulliParams {
  p: number;
}

export interface BinomialParams {
  n: number;
  p: number;
}

export interface PoissonParams {
  lambda: number;
}

// Continuous Distribution Parameters
export interface NormalParams {
  mu: number;      // mean
  sigma: number;   // standard deviation
}

export interface TDistributionParams {
  df: number;      // degrees of freedom
  mu: number;      // location parameter
  sigma: number;   // scale parameter
}

export type DiscreteParams = BernoulliParams | BinomialParams | PoissonParams;
export type ContinuousParams = NormalParams | TDistributionParams;
export type AppParams = DiscreteParams | ContinuousParams;

// Chart Data Points
export interface ChartDataPoint {
  k: number;
  frequency: number;
  theoretical: number;
}

export interface ContinuousChartDataPoint {
  x: number;
  frequency: number;
  theoretical: number;
}

// CLT Simulator Types
export interface CLTParams {
  populationMean: number;
  populationStdDev: number;
  sampleSize: number;
  numSamples: number;
  populationType: 'uniform' | 'exponential' | 'skewed';
}

export interface CLTResult {
  sampleMeans: number[];
  populationData: number[];
  theoreticalMean: number;
  theoreticalStdError: number;
}

// Z-Score Calculator Types
export interface ZScoreInput {
  value: number;
  mean: number;
  stdDev: number;
}

export interface ZScoreResult {
  zScore: number;
  probability: number;
  percentile: number;
}

// EDA Types
export interface DataPoint {
  value: number;
  label?: string;
}

export interface CorrelationData {
  x: number[];
  y: number[];
  correlation: number;
}

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
  frequency: number;
}