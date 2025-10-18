# Discrete Distribution Simulator

An interactive web application for exploring and understanding discrete probability distributions through simulation and visualization. This tool helps students and professionals understand the probabilistic foundations of AI and machine learning.

## Features

- **Interactive Simulations**: Run Monte Carlo simulations for three key discrete distributions:
  - **Bernoulli Distribution**: Single trial with binary outcomes (0 or 1)
  - **Binomial Distribution**: Multiple independent trials with fixed probability
  - **Poisson Distribution**: Events occurring at a constant rate over time/space

- **Real-time Visualization**: 
  - Interactive charts showing simulation results vs theoretical distributions
  - Toggle between empirical and theoretical probability mass functions
  - Dynamic parameter adjustment with sliders and input controls

- **Educational Tools**:
  - Built-in tooltips explaining key concepts
  - Real-time calculation of expected values and variance
  - Comparison between simulation results and mathematical theory

- **Modern UI**: Clean, responsive interface built with React and TypeScript

## Supported Distributions

### Bernoulli Distribution
- **Parameters**: p (probability of success)
- **Use Case**: Binary classification, coin flips, success/failure events
- **Formula**: P(X=1) = p, P(X=0) = 1-p

### Binomial Distribution  
- **Parameters**: n (number of trials), p (probability of success per trial)
- **Use Case**: Counting successes in repeated independent trials
- **Formula**: P(X=k) = C(n,k) × p^k × (1-p)^(n-k)

### Poisson Distribution
- **Parameters**: λ (lambda - average rate of events)
- **Use Case**: Modeling rare events, arrival times, counting occurrences
- **Formula**: P(X=k) = (λ^k × e^(-λ)) / k!

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **Styling**: Tailwind CSS (utility classes)
- **Simulation**: Custom Monte Carlo algorithms

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd discrete-distribution-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select a Distribution**: Choose from Bernoulli, Binomial, or Poisson
2. **Adjust Parameters**: Use sliders and input fields to set distribution parameters
3. **Run Simulation**: Click "Run Simulation" to generate 1000 random samples
4. **Analyze Results**: Compare empirical results with theoretical distributions
5. **Toggle Views**: Use the checkbox to show/hide theoretical probability mass functions

## Project Structure

```
├── components/           # React components
│   ├── ControlPanel.tsx    # Parameter controls and distribution selection
│   ├── SimulationChart.tsx  # Chart visualization component
│   ├── ResultsPanel.tsx     # Statistics and results display
│   ├── Tooltip.tsx          # Help tooltip component
│   └── InfoIcon.tsx         # Information icon component
├── services/            # Business logic
│   └── simulationService.ts # Distribution algorithms and calculations
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Educational Value

This simulator is designed to help users understand:

- **Probability Theory**: How discrete distributions model real-world randomness
- **Monte Carlo Methods**: How simulation approximates theoretical distributions
- **Statistical Concepts**: Expected values, variance, and probability mass functions
- **AI/ML Foundations**: The probabilistic thinking essential for machine learning

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is open source and available under the MIT License.
