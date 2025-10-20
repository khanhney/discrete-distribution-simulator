import React, { useState } from 'react';
import { DiscreteDistribution, BernoulliParams, BinomialParams, PoissonParams } from '../types';

interface DiscreteEducationalPanelProps {
  distribution: DiscreteDistribution;
  params: any;
  onLoadExample: (params: any) => void;
}

const DiscreteEducationalPanel: React.FC<DiscreteEducationalPanelProps> = ({ 
  distribution, 
  params,
  onLoadExample 
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'applications'>('theory');

  const getContent = () => {
    switch(distribution) {
      case DiscreteDistribution.Bernoulli:
        return {
          theory: {
            title: "Phân phối Bernoulli - Binary Outcome",
            definition: "Phân phối Bernoulli mô tả thí nghiệm chỉ có 2 kết quả: Thành công (1) hoặc Thất bại (0)",
            formula: "P(X = 1) = p, P(X = 0) = 1 - p",
            parameters: [
              { name: "p", meaning: "Xác suất thành công", range: "0 ≤ p ≤ 1", example: "p = 0.6 nghĩa là 60% chance thành công" }
            ],
            statistics: [
              { name: "E[X] (Expected Value)", formula: "p", meaning: "Giá trị trung bình kỳ vọng" },
              { name: "Var[X] (Variance)", formula: "p(1-p)", meaning: "Độ biến động của kết quả" }
            ],
            keyInsights: [
              "🎯 Là building block cơ bản nhất của xác suất",
              "🔄 Mỗi thí nghiệm độc lập với nhau",
              "💡 Variance lớn nhất khi p = 0.5 (maximum uncertainty)",
              "📊 Khi p gần 0 hoặc 1, kết quả càng predictable"
            ]
          },
          examples: [
            {
              title: "🪙 Toss Coin (Tung đồng xu)",
              description: "Tung một đồng xu công bằng",
              params: { p: 0.5 },
              scenario: "Success = Mặt ngửa (Heads), Failure = Mặt sấp (Tails)",
              interpretation: "Với p=0.5, mỗi lần tung có 50% chance ra ngửa. Đây là trường hợp uncertainty tối đa.",
              realData: "Nếu tung 100 lần, expect ~50 lần ngửa (có thể 45-55 do randomness)"
            },
            {
              title: "📧 Email Spam Detection",
              description: "AI classifier phân loại email",
              params: { p: 0.15 },
              scenario: "Success = Email là spam, Failure = Email hợp lệ",
              interpretation: "Với p=0.15, model dự đoán 15% emails là spam. Mỗi email là một Bernoulli trial.",
              realData: "Dataset thực: Gmail filters ~50 billion spam emails/day với accuracy ~99.9%"
            },
            {
              title: "🎯 Click-Through Rate",
              description: "User click vào quảng cáo",
              params: { p: 0.03 },
              scenario: "Success = User clicks ad, Failure = User ignores",
              interpretation: "CTR = 3% là typical cho display ads. Mỗi impression là một Bernoulli trial.",
              realData: "Industry average: Search ads ~3-5%, Display ads ~0.5-1%, Social media ~1-2%"
            },
            {
              title: "🏥 Medical Test Result",
              description: "Test xem bệnh nhân có disease",
              params: { p: 0.02 },
              scenario: "Success = Positive (có bệnh), Failure = Negative",
              interpretation: "Prevalence 2% trong population. Test từng người = Bernoulli trial.",
              realData: "COVID-19 rapid test: Sensitivity ~85%, Specificity ~98%"
            }
          ],
          applications: {
            ml: [
              {
                name: "🤖 Logistic Regression",
                description: "Output layer của binary classifier",
                explanation: "Model outputs probability p cho class 1. Prediction là một Bernoulli(p) random variable.",
                code: "sigmoid(z) = 1/(1+e^(-z)) → p\nPrediction ~ Bernoulli(p)"
              },
              {
                name: "🎲 Dropout in Neural Networks",
                description: "Randomly drop neurons during training",
                explanation: "Mỗi neuron có probability p bị drop. Drop/keep quyết định theo Bernoulli(p).",
                code: "mask = Bernoulli(keep_prob=0.5)\noutput = input * mask"
              },
              {
                name: "📊 A/B Testing",
                description: "Test version A vs B",
                explanation: "User chọn A hoặc B. Conversion = Bernoulli(p_A) vs Bernoulli(p_B).",
                code: "H0: p_A = p_B\nH1: p_A ≠ p_B"
              }
            ],
            industries: [
              "🏦 Finance: Default/No default on loan",
              "🛒 E-commerce: Purchase/No purchase",
              "🎮 Gaming: Win/Lose a match",
              "📱 Apps: User retention (active/inactive)"
            ]
          }
        };

      case DiscreteDistribution.Binomial:
        return {
          theory: {
            title: "Phân phối Nhị thức - Counting Successes",
            definition: "Đếm số lần thành công trong n thí nghiệm Bernoulli độc lập, mỗi thí nghiệm có xác suất thành công p",
            formula: "P(X = k) = C(n,k) × p^k × (1-p)^(n-k)",
            parameters: [
              { name: "n", meaning: "Số lần thử", range: "n ≥ 1 (integer)", example: "n = 10 nghĩa là thực hiện 10 lần" },
              { name: "p", meaning: "Xác suất thành công mỗi lần", range: "0 ≤ p ≤ 1", example: "p = 0.3 nghĩa là 30% chance mỗi lần" },
              { name: "k", meaning: "Số lần thành công muốn tính", range: "0 ≤ k ≤ n", example: "k = 7 nghĩa là thành công đúng 7 lần" }
            ],
            statistics: [
              { name: "E[X]", formula: "n × p", meaning: "Expected số lần thành công" },
              { name: "Var[X]", formula: "n × p × (1-p)", meaning: "Variability tăng theo n" },
              { name: "Mode", formula: "floor((n+1)p)", meaning: "Giá trị xảy ra nhiều nhất" }
            ],
            keyInsights: [
              "🎯 Là tổng của n Bernoulli độc lập: X = X₁ + X₂ + ... + Xₙ",
              "📊 Symmetric khi p=0.5, skewed khi p gần 0 hoặc 1",
              "🔄 Khi n lớn, p nhỏ: Binomial(n,p) ≈ Poisson(λ=np)",
              "📈 Khi n lớn: Binomial ≈ Normal(μ=np, σ²=np(1-p)) theo CLT"
            ]
          },
          examples: [
            {
              title: "🎯 Model Accuracy Testing",
              description: "Test ML model trên test set",
              params: { n: 20, p: 0.85 },
              scenario: "Model có accuracy 85%. Test trên 20 samples.",
              interpretation: "X = số predictions đúng. E[X] = 20×0.85 = 17. Likely get 15-19 correct.",
              realData: "Real model: Train accuracy 90%, Test accuracy 85% → overfitting ~5%"
            },
            {
              title: "🎲 Quality Control",
              description: "Kiểm tra sản phẩm lỗi",
              params: { n: 50, p: 0.02 },
              scenario: "Defect rate = 2%. Inspect 50 units.",
              interpretation: "X = số products lỗi. E[X] = 50×0.02 = 1. Most likely 0-3 defects.",
              realData: "Six Sigma: 3.4 defects per million (p = 0.0000034)"
            },
            {
              title: "📞 Customer Service Calls",
              description: "Call center resolution rate",
              params: { n: 100, p: 0.75 },
              scenario: "75% calls resolved first time. Handle 100 calls/day.",
              interpretation: "X = số calls resolved. E[X] = 75. Std dev = √(100×0.75×0.25) = 4.33.",
              realData: "Industry benchmark: First Call Resolution 70-75%"
            },
            {
              title: "🎰 Ensemble Voting",
              description: "5 models vote cho prediction",
              params: { n: 5, p: 0.80 },
              scenario: "Mỗi model có 80% accuracy. Majority vote.",
              interpretation: "Need ≥3 correct. P(X≥3) = P(3) + P(4) + P(5) ≈ 94%! Better than single model.",
              realData: "Random Forest: Combines 100-500 decision trees, each ~65% accurate → 90%+ ensemble accuracy"
            }
          ],
          applications: {
            ml: [
              {
                name: "🌲 Random Forest Voting",
                description: "Combine predictions từ nhiều trees",
                explanation: "Mỗi tree vote. Assume mỗi tree correct với prob p. Final prediction = majority vote theo Binomial.",
                code: "votes = [tree.predict(x) for tree in forest]\nprediction = majority(votes)  # Binomial(n_trees, p)"
              },
              {
                name: "🎯 Cross-Validation",
                description: "Evaluate model stability",
                explanation: "K-fold CV: Trong k runs, count bao nhiêu lần model performs well. Success count ~ Binomial.",
                code: "scores = cross_val_score(model, X, y, cv=10)\nn_good = sum(score > threshold)  # Binomial(10, p)"
              },
              {
                name: "📊 Batch Inference",
                description: "Predict cho batch of inputs",
                explanation: "Process n samples. Count correct predictions = Binomial(n, accuracy).",
                code: "predictions = model.predict(batch)\ncorrect = sum(pred == true for pred, true in zip(predictions, labels))"
              }
            ],
            industries: [
              "🏥 Clinical Trials: n patients, count successes",
              "📈 Marketing: n campaigns, count conversions",
              "🔒 Security: n login attempts, count breaches",
              "📱 Mobile: n users, count active users"
            ]
          }
        };

      case DiscreteDistribution.Poisson:
        return {
          theory: {
            title: "Phân phối Poisson - Counting Rare Events",
            definition: "Đếm số lần xảy ra sự kiện trong một khoảng thời gian/không gian cố định, khi events xảy ra độc lập với rate trung bình λ",
            formula: "P(X = k) = (λ^k × e^(-λ)) / k!",
            parameters: [
              { name: "λ (lambda)", meaning: "Average rate - số events kỳ vọng", range: "λ > 0", example: "λ = 3 nghĩa là trung bình 3 events per time period" }
            ],
            statistics: [
              { name: "E[X]", formula: "λ", meaning: "Mean = λ" },
              { name: "Var[X]", formula: "λ", meaning: "Variance = λ (unique property!)" },
              { name: "Mode", formula: "floor(λ)", meaning: "Most likely value" }
            ],
            keyInsights: [
              "🎯 Model 'rare events' - events xảy ra randomly over time/space",
              "⚖️ Mean = Variance = λ (equidispersion property)",
              "🔄 Limit of Binomial: n→∞, p→0, np=λ constant",
              "📈 Khi λ lớn (>20): Poisson ≈ Normal(μ=λ, σ²=λ)",
              "⏱️ Time between events ~ Exponential(λ)"
            ]
          },
          examples: [
            {
              title: "📧 Email Arrivals",
              description: "Emails received per hour",
              params: { lambda: 5 },
              scenario: "Trung bình 5 emails/hour. Count emails in next hour.",
              interpretation: "X = số emails. E[X] = 5. Most likely values: 3-7 emails. P(X=0) = e^(-5) ≈ 0.7%.",
              realData: "Office worker: ~120 emails/day = 5 emails/hour (assuming 8-hour workday)"
            },
            {
              title: "🌐 Website Traffic",
              description: "Page views per minute",
              params: { lambda: 12 },
              scenario: "Website gets 12 views/minute on average.",
              interpretation: "X = views in next minute. Std dev = √12 ≈ 3.46. Expect 8-16 views (~1σ range).",
              realData: "High-traffic site: 10K-100K requests/min. Use Poisson for capacity planning."
            },
            {
              title: "🐛 Bug Reports",
              description: "Software bugs discovered per week",
              params: { lambda: 2.5 },
              scenario: "Team finds 2.5 bugs/week on average.",
              interpretation: "X = bugs next week. E[X] = 2.5. P(X≥5) = chance of bad week. Use for sprint planning.",
              realData: "Industry: 15-50 defects per 1000 lines of code. Varies widely by language/domain."
            },
            {
              title: "☎️ Call Center Queue",
              description: "Incoming calls per 5 minutes",
              params: { lambda: 8 },
              scenario: "Call center receives 8 calls per 5-min window.",
              interpretation: "X = calls in next 5 min. P(X>12) = probability of overload. Use for staffing.",
              realData: "Peak hours: 2-3x normal rate. Poisson helps determine # of agents needed."
            },
            {
              title: "🔍 Search Query Volume",
              description: "Searches for keyword per day",
              params: { lambda: 150 },
              scenario: "Keyword gets 150 searches/day.",
              interpretation: "Since λ is large, Poisson ≈ Normal(150, 150). Std dev = √150 ≈ 12.2.",
              realData: "SEO: Track daily volume. Sudden spikes indicate trending topics or seasonality."
            }
          ],
          applications: {
            ml: [
              {
                name: "📝 Natural Language Processing",
                description: "Word frequency modeling",
                explanation: "Count occurrences of word in document ~ Poisson(λ). Basis for TF-IDF, word embeddings.",
                code: "word_count = count_word_in_doc(word, doc)  # Poisson(λ_word)\ntf = word_count / total_words"
              },
              {
                name: "🎬 Recommendation Systems",
                description: "User interaction counts",
                explanation: "# of clicks/purchases per user per day ~ Poisson. Model user engagement.",
                code: "daily_clicks = count_user_clicks(user_id, date)  # Poisson(λ_user)\nengagement_score = f(daily_clicks)"
              },
              {
                name: "🚗 Poisson Regression",
                description: "Predict count outcomes",
                explanation: "Y = count (e.g., # accidents). Model: log(λ) = β₀ + β₁X₁ + ... Linear in log scale.",
                code: "from sklearn.linear_model import PoissonRegressor\nmodel.fit(X, y_counts)  # y ~ Poisson(λ(X))"
              },
              {
                name: "⏱️ Event Timing",
                description: "Model time between events",
                explanation: "If events ~ Poisson(λ) per time unit, then time between events ~ Exponential(λ).",
                code: "inter_arrival_time = Exponential(rate=λ)\nnext_event_time = current_time + inter_arrival_time"
              }
            ],
            industries: [
              "🏥 Healthcare: Patient arrivals, disease cases",
              "🚗 Transportation: Traffic accidents, vehicle arrivals",
              "☁️ Cloud Computing: Server requests, failures",
              "📱 Social Media: Posts, likes, comments per time unit",
              "🏭 Manufacturing: Machine failures, defects",
              "📞 Telecom: Call arrivals, network packets"
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
    <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 min-w-[100px] px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'theory'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <span className="block sm:inline">📚</span>
          <span className="hidden sm:inline"> Lý thuyết</span>
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 min-w-[100px] px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'examples'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <span className="block sm:inline">💡</span>
          <span className="hidden sm:inline"> Ví dụ</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 min-w-[100px] px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <span className="block sm:inline">🤖</span>
          <span className="hidden sm:inline"> ML/AI</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6">
        {activeTab === 'theory' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{content.theory.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{content.theory.definition}</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
              <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">📐 Công thức:</h4>
              <p className="font-mono text-sm sm:text-lg text-gray-800 break-all">{content.theory.formula}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-3">🎛️ Tham số (Parameters):</h4>
              <div className="space-y-2 sm:space-y-3">
                {content.theory.parameters.map((param, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <div className="block sm:flex sm:items-start">
                      <span className="font-mono font-bold text-primary-600 mr-0 sm:mr-3 text-sm mb-1 block sm:inline">{param.name}</span>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 mb-1">{param.meaning}</p>
                        <p className="text-xs text-gray-500">Range: {param.range}</p>
                        <p className="text-xs text-blue-600 mt-1">💡 {param.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Thống kê (Statistics):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.theory.statistics.map((stat, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="font-semibold text-gray-800">{stat.name}</p>
                    <p className="font-mono text-purple-600 my-1">{stat.formula}</p>
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
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
              Click vào ví dụ để tự động load parameters và chạy simulation!
            </p>
            {content.examples.map((example, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <button
                  onClick={() => onLoadExample(example.params)}
                  className="w-full text-left p-3 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{example.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">{example.description}</p>
                      
                      <div className="space-y-2">
                        <div className="bg-white bg-opacity-70 p-2 rounded">
                          <p className="text-xs font-semibold text-gray-700">📋 Scenario:</p>
                          <p className="text-xs sm:text-sm text-gray-800">{example.scenario}</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-70 p-2 rounded">
                          <p className="text-xs font-semibold text-gray-700">🔍 Interpretation:</p>
                          <p className="text-xs sm:text-sm text-gray-800">{example.interpretation}</p>
                        </div>
                        
                        <div className="bg-green-50 bg-opacity-70 p-2 rounded border border-green-200">
                          <p className="text-xs font-semibold text-green-700">📈 Real Data:</p>
                          <p className="text-xs sm:text-sm text-gray-800">{example.realData}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 flex-shrink-0">
                      <div className="bg-primary-500 text-white px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap">
                        Try it! →
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">🤖 Machine Learning Applications</h3>
              <div className="space-y-3 sm:space-y-4">
                {content.applications.ml.map((app, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-5">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{app.name}</h4>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">{app.description}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{app.explanation}</p>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre className="whitespace-pre-wrap sm:whitespace-pre break-all sm:break-normal">{app.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🏭 Industry Applications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.applications.industries.map((industry, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{industry}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-5 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">🎯 Tại sao quan trọng cho AI/ML?</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ <strong>Hiểu uncertainty:</strong> ML models predict probabilities, not certainties</li>
                <li>✅ <strong>Model evaluation:</strong> Understand performance metrics và confidence</li>
                <li>✅ <strong>Feature engineering:</strong> Transform data dựa trên distribution properties</li>
                <li>✅ <strong>Algorithm design:</strong> Nhiều ML algorithms built on probabilistic foundations</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscreteEducationalPanel;

