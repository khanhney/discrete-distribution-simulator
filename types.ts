
export enum Distribution {
  Bernoulli = 'bernoulli',
  Binomial = 'binomial',
  Poisson = 'poisson',
}

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

export type AppParams = BernoulliParams | BinomialParams | PoissonParams;

export interface ChartDataPoint {
  k: number;
  frequency: number;
  theoretical: number;
}
