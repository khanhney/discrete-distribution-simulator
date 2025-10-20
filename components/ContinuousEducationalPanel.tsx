import React, { useState } from 'react';
import { ContinuousDistribution } from '../types';

interface ContinuousEducationalPanelProps {
  distribution: ContinuousDistribution;
}

const ContinuousEducationalPanel: React.FC<ContinuousEducationalPanelProps> = ({ distribution }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'applications'>('theory');

  const getContent = () => {
    switch(distribution) {
      case ContinuousDistribution.Normal:
        return {
          theory: {
            title: "Phân phối Chuẩn (Normal/Gaussian Distribution)",
            subtitle: "The most important distribution in statistics!",
            definition: "Phân phối chuẩn mô tả nhiều hiện tượng tự nhiên và là nền tảng của thống kê suy diễn. Có hình chuông (bell curve), symmetric quanh mean μ.",
            formula: "f(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))",
            parameters: [
              { 
                name: "μ (mu)", 
                meaning: "Mean - giá trị trung bình", 
                range: "-∞ < μ < ∞", 
                example: "μ = 0 cho standard normal. μ shifts đường cong sang trái/phải."
              },
              { 
                name: "σ (sigma)", 
                meaning: "Standard deviation - độ lệch chuẩn", 
                range: "σ > 0", 
                example: "σ = 1 cho standard normal. σ nhỏ → narrow, σ lớn → wide distribution."
              }
            ],
            statistics: [
              { name: "Mean", formula: "μ", meaning: "Center of distribution" },
              { name: "Median", formula: "μ", meaning: "Same as mean (symmetric)" },
              { name: "Mode", formula: "μ", meaning: "Peak of curve" },
              { name: "Variance", formula: "σ²", meaning: "Spread of distribution" },
              { name: "Std Dev", formula: "σ", meaning: "Average distance from mean" }
            ],
            keyInsights: [
              "🎯 68% dữ liệu nằm trong [μ-σ, μ+σ] (1 std dev)",
              "📊 95% dữ liệu nằm trong [μ-2σ, μ+2σ] (2 std devs)",
              "📈 99.7% dữ liệu nằm trong [μ-3σ, μ+3σ] (3 std devs) - 'Three Sigma Rule'",
              "⚖️ Symmetric: P(X < μ-a) = P(X > μ+a) for any a",
              "🔄 Linear transformations: aX + b ~ N(aμ+b, a²σ²)",
              "➕ Sum of normals: X₁+X₂ ~ N(μ₁+μ₂, σ₁²+σ₂²) if independent"
            ]
          },
          examples: [
            {
              title: "📏 Human Heights",
              scenario: "Height của nam giới Việt Nam: μ = 168cm, σ = 7cm",
              interpretation: "• 68% nam giới có height 161-175cm (±1σ)\n• 95% có height 154-182cm (±2σ)\n• Người cao 182cm = μ+2σ → top 2.5%",
              mlApplication: "Feature scaling trong ML: StandardScaler chuyển về N(0,1) để tất cả features cùng scale.",
              realData: "WHO data: VN males avg 168cm. Global avg: 175cm. Useful for ergonomics, clothing sizing."
            },
            {
              title: "📊 IQ Scores",
              scenario: "IQ scores: μ = 100, σ = 15",
              interpretation: "• IQ 130 = μ+2σ → top 2.3% (gifted)\n• IQ 70 = μ-2σ → bottom 2.3%\n• Most people (68%) have IQ 85-115",
              mlApplication: "Anomaly detection: Values >3σ from mean considered outliers. Auto-flag unusual patterns.",
              realData: "WAIS-IV test normalized to N(100,15). Mensa requires IQ≥130 (98th percentile)."
            },
            {
              title: "📈 Stock Returns",
              scenario: "Daily returns của VN-Index: μ = 0.05%, σ = 1.2%",
              interpretation: "• 95% ngày: returns trong [-2.35%, 2.45%]\n• Drop >3.6% (3σ) = crash (0.15% probability)\n• Model risk cho portfolio",
              mlApplication: "Financial ML: Predict returns, risk management. VAR (Value at Risk) uses normal approximation.",
              realData: "Black Monday 1987: -22.6% ≈ 20σ event! Normal underestimates tail risk (fat tails)."
            },
            {
              title: "🎯 Model Predictions",
              scenario: "ML model prediction errors: μ = 0, σ = 5",
              interpretation: "• Errors centered at 0 (unbiased)\n• 95% predictions within ±10 units of true value\n• Use σ for confidence intervals",
              mlApplication: "Regression: Assume errors ~ N(0,σ²). OLS estimator is optimal. Confidence intervals based on this.",
              realData: "Residual plots should look random. Pattern → model misspecification. Normality assumption crucial."
            },
            {
              title: "⚡ Sensor Noise",
              scenario: "Temperature sensor: True=25°C, Noise ~ N(0, 0.5°C)",
              interpretation: "• Readings: 25 ± 0.5°C typical\n• Reading 27°C = 4σ away → likely sensor malfunction\n• Average multiple readings to reduce noise",
              mlApplication: "Signal processing: Kalman filter assumes Gaussian noise. Averaging n readings → σ/√n noise reduction.",
              realData: "IoT sensors: Gaussian noise is standard assumption. Non-Gaussian → need robust algorithms."
            }
          ],
          applications: {
            ml: [
              {
                name: "🎲 Feature Scaling (Standardization)",
                description: "Transform features to N(0,1)",
                explanation: "Most ML algorithms work better when features have similar scales. StandardScaler: z = (x-μ)/σ.",
                code: `from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()  # Fit to N(0,1)
X_scaled = scaler.fit_transform(X)
# Now each feature ~ N(0,1)`
              },
              {
                name: "🧠 Weight Initialization",
                description: "Initialize neural network weights",
                explanation: "Xavier/He initialization draws weights from N(0, σ²) where σ depends on layer size. Prevents vanishing/exploding gradients.",
                code: `# PyTorch Xavier Normal
nn.init.xavier_normal_(layer.weight)

# Keras He Normal  
Dense(units, kernel_initializer='he_normal')`
              },
              {
                name: "📊 Gaussian Naive Bayes",
                description: "Classification với normal distribution",
                explanation: "Assume P(X|Y=k) ~ N(μₖ, σₖ²). Learn μₖ, σₖ from data. Fast, works well for continuous features.",
                code: `from sklearn.naive_bayes import GaussianNB
model = GaussianNB()
model.fit(X_train, y_train)  # Learns μ,σ per class`
              },
              {
                name: "🎯 Confidence Intervals",
                description: "Uncertainty quantification",
                explanation: "Regression predictions: ŷ ± 1.96σ̂ gives 95% CI. Crucial for decision-making under uncertainty.",
                code: `# Scikit-learn
from sklearn.linear_model import LinearRegression
model.fit(X, y)
pred = model.predict(X_test)
# CI = pred ± 1.96 * std_error`
              },
              {
                name: "🔍 Anomaly Detection",
                description: "Find outliers using normal assumption",
                explanation: "Calculate z-score. Flag |z| > 3 as anomalies. Works if data approximately normal.",
                code: `z_scores = (X - X.mean()) / X.std()
anomalies = np.abs(z_scores) > 3
# Returns True for outliers`
              },
              {
                name: "🌀 Variational Autoencoders (VAE)",
                description: "Generative model with normal latent space",
                explanation: "Encode data to latent space ~ N(μ, σ²). Decode to reconstruct. μ,σ learned by encoder network.",
                code: `# Latent space
z_mean = encoder(x)
z_log_var = encoder(x) 
z = z_mean + exp(z_log_var/2) * ε
# where ε ~ N(0,1)`
              }
            ],
            industries: [
              "📊 Finance: Stock returns, risk management, option pricing (Black-Scholes)",
              "🏥 Healthcare: Test results, drug efficacy, patient vitals",
              "🏭 Manufacturing: Quality control, process monitoring (Six Sigma)",
              "📡 Telecommunications: Signal processing, noise modeling",
              "🌡️ Physics: Measurement errors, quantum mechanics",
              "📈 Economics: Income distribution (log-normal), demand forecasting",
              "🧪 Science: Experimental errors, hypothesis testing",
              "🤖 AI/ML: Nearly all statistical ML methods assume normality somewhere"
            ]
          }
        };

      case ContinuousDistribution.TDistribution:
        return {
          theory: {
            title: "Phân phối t (Student's t-Distribution)",
            subtitle: "For small samples and unknown variance",
            definition: "Phân phối t giống Normal nhưng có đuôi dày hơn (heavier tails). Dùng khi cỡ mẫu nhỏ (n<30) hoặc không biết population variance σ.",
            formula: "f(x) = Γ((ν+1)/2) / (√(νπ) Γ(ν/2)) × (1 + x²/ν)^(-(ν+1)/2)",
            parameters: [
              { 
                name: "ν (nu) - Degrees of Freedom", 
                meaning: "df = n - 1 where n = sample size", 
                range: "ν > 0 (usually integer)", 
                example: "Sample of n=10 → df=9. Khi ν→∞, t→Normal."
              },
              { 
                name: "μ (location)", 
                meaning: "Center of distribution", 
                range: "-∞ < μ < ∞", 
                example: "Usually μ=0 for standard t. Shifts curve left/right."
              },
              { 
                name: "σ (scale)", 
                meaning: "Spread parameter", 
                range: "σ > 0", 
                example: "σ=1 for standard t. Affects width of distribution."
              }
            ],
            statistics: [
              { name: "Mean", formula: "μ (if ν > 1)", meaning: "Undefined for ν≤1" },
              { name: "Variance", formula: "ν/(ν-2) × σ² (if ν > 2)", meaning: "Undefined for ν≤2. Always > σ² (heavier tails)" },
              { name: "Mode", formula: "μ", meaning: "Peak at center" }
            ],
            keyInsights: [
              "🎯 Heavier tails than Normal → more outliers",
              "📊 Khi df small: Tails rất dày. Khi df→∞: → Normal distribution",
              "📈 df=1: Cauchy distribution (mean undefined!)",
              "⚖️ df=30: Practically indistinguishable from Normal",
              "🔄 Used for: t-tests, confidence intervals với small samples",
              "💡 Robust to small samples - doesn't assume σ known"
            ]
          },
          examples: [
            {
              title: "🔬 Small Sample Experiment",
              scenario: "Test new drug on n=10 patients. Sample mean x̄=5, s=2.",
              interpretation: "• Use t-distribution with df=9 (not Normal)\n• 95% CI: x̄ ± t₀.₀₂₅,₉ × s/√10\n• t₀.₀₂₅,₉ = 2.262 (wider than z=1.96)",
              mlApplication: "Small dataset ML: Bootstrap + t-CI for performance metrics. More conservative than normal-based CI.",
              realData: "Clinical trials: Phase I typically n=20-80. Phase II: n=100-300. Use t for early phases."
            },
            {
              title: "📊 A/B Test with Limited Data",
              scenario: "Compare 2 website versions. Each seen by 15 users.",
              interpretation: "• Use 2-sample t-test (df=28)\n• Heavier tails account for small sample uncertainty\n• p-value threshold: 0.05 as usual",
              mlApplication: "Compare ML models on small validation sets. Paired t-test for matched comparisons.",
              realData: "Startup MVPs: Limited traffic. t-test more appropriate than z-test. Don't assume normality blindly."
            },
            {
              title: "🎓 Class Performance",
              scenario: "8 students take exam. Scores: x̄=75, s=12.",
              interpretation: "• Population σ unknown → use t(df=7)\n• 90% CI for true mean: 75 ± 1.895×12/√8\n• = 75 ± 8.04 = [66.96, 83.04]",
              mlApplication: "K-fold CV with k=5: Only 5 accuracy scores → use t for CI. Accounts for estimation uncertainty.",
              realData: "Education research: Small class sizes common. t-test standard for comparing teaching methods."
            },
            {
              title: "🏭 Manufacturing QC",
              scenario: "Sample 12 products. Measure thickness.",
              interpretation: "• df=11. Use t for confidence intervals\n• Detect if process mean shifted from target\n• One-sample t-test",
              mlApplication: "Model monitoring: Limited recent predictions. Use t-test to detect performance drift.",
              realData: "ISO standards: Accept/reject decisions based on t-tests when sample size limited by cost."
            },
            {
              title: "🧪 Bayesian Prior",
              scenario: "Uninformative prior for mean parameter",
              interpretation: "• Student-t often used as prior in Bayesian models\n• Heavier tails = more robust to outliers\n• df as hyperparameter",
              mlApplication: "Bayesian neural networks: t-distribution priors on weights → robustness. PyMC3, Stan support.",
              realData: "Robust regression: Model errors as t instead of Normal → automatic outlier downweighting."
            }
          ],
          applications: {
            ml: [
              {
                name: "📊 Hypothesis Testing",
                description: "t-test for comparing means",
                explanation: "When σ unknown: use t-statistic instead of z. More conservative with small samples.",
                code: `from scipy.stats import ttest_ind
# Compare two groups
t_stat, p_value = ttest_ind(group1, group2)
if p_value < 0.05:
    print("Significantly different")`
              },
              {
                name: "🎯 Confidence Intervals",
                description: "CI for small samples",
                explanation: "Use t-quantiles instead of z-quantiles. Wider intervals = more honest uncertainty.",
                code: `from scipy.stats import t
n = len(data)
df = n - 1
ci = mean ± t.ppf(0.975, df) * std / sqrt(n)
# 95% CI using t-distribution`
              },
              {
                name: "🔄 Cross-Validation Comparison",
                description: "Compare model performance",
                explanation: "Limited CV folds → t-test. Paired t-test if same folds used.",
                code: `from scipy.stats import ttest_rel
# Paired t-test (same CV folds)
t_stat, p = ttest_rel(model1_scores, model2_scores)
# Is model1 significantly better?`
              },
              {
                name: "🛡️ Robust Regression",
                description: "Model errors with t instead of Normal",
                explanation: "Heavy tails automatically downweight outliers. No manual outlier removal needed.",
                code: `# Robust linear regression
from scipy.stats import t
# Assume errors ~ t(df) instead of N(0,σ²)
# MLE or Bayesian estimation`
              },
              {
                name: "🎲 Bayesian Modeling",
                description: "Prior distributions",
                explanation: "t-prior on parameters → robustness. Common in Stan, PyMC3.",
                code: `# PyMC3
import pymc3 as pm
with pm.Model():
    # t-prior instead of Normal
    beta = pm.StudentT('beta', nu=3, mu=0, sigma=1)`
              }
            ],
            industries: [
              "🔬 Research: Most scientific studies use t-tests (small n)",
              "🏥 Clinical Trials: Phase I/II with limited patients",
              "📊 Finance: Risk modeling (fat tails = better for crashes)",
              "🎓 Education: Classroom experiments, pilot studies",
              "🏭 Quality Control: Small batch testing",
              "📱 Tech: A/B tests with limited traffic",
              "🧪 Data Science: Model comparison with limited compute",
              "🤖 ML: Bayesian ML for robustness"
            ]
          }
        };

      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'theory'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          📚 Lý thuyết
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'examples'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          💡 Ví dụ thực tế
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          🤖 Ứng dụng ML/AI
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{content.theory.title}</h3>
              <p className="text-sm text-primary-600 font-medium mb-3">{content.theory.subtitle}</p>
              <p className="text-gray-700 leading-relaxed">{content.theory.definition}</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">📐 Công thức PDF:</h4>
              <p className="font-mono text-sm text-gray-800">{content.theory.formula}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎛️ Parameters:</h4>
              <div className="space-y-3">
                {content.theory.parameters.map((param, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <span className="font-mono font-bold text-primary-600 mr-3 text-sm">{param.name}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-1">{param.meaning}</p>
                        <p className="text-xs text-gray-500 mb-1">Range: {param.range}</p>
                        <p className="text-xs text-blue-600">💡 {param.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Statistics:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.theory.statistics.map((stat, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="font-semibold text-gray-800 text-sm">{stat.name}</p>
                    <p className="font-mono text-purple-600 my-1 text-sm">{stat.formula}</p>
                    <p className="text-xs text-gray-600">{stat.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">💎 Key Insights:</h4>
              <ul className="space-y-2">
                {content.theory.keyInsights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            {content.examples.map((example, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="text-lg font-bold text-gray-800 mb-3">{example.title}</h4>
                
                <div className="space-y-3">
                  <div className="bg-white bg-opacity-70 p-3 rounded">
                    <p className="text-xs font-semibold text-gray-700 mb-1">📋 Scenario:</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line">{example.scenario}</p>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 p-3 rounded">
                    <p className="text-xs font-semibold text-gray-700 mb-1">🔍 Interpretation:</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line">{example.interpretation}</p>
                  </div>
                  
                  <div className="bg-purple-50 bg-opacity-70 p-3 rounded border border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 mb-1">🤖 ML Application:</p>
                    <p className="text-sm text-gray-800">{example.mlApplication}</p>
                  </div>
                  
                  <div className="bg-green-50 bg-opacity-70 p-3 rounded border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">📈 Real Data:</p>
                    <p className="text-sm text-gray-800">{example.realData}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🤖 Machine Learning Applications</h3>
              <div className="space-y-4">
                {content.applications.ml.map((app, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{app.name}</h4>
                    <p className="text-sm font-medium text-gray-700 mb-2">{app.description}</p>
                    <p className="text-sm text-gray-600 mb-3">{app.explanation}</p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{app.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🏭 Industry Applications</h3>
              <div className="grid grid-cols-1 gap-2">
                {content.applications.industries.map((industry, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{industry}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinuousEducationalPanel;

