import React, { useState } from 'react';

interface PathStep {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  completed: boolean;
}

const LearningPathGuide: React.FC = () => {
  const [expandedLevel, setExpandedLevel] = useState<string | null>('beginner');

  const learningPath = {
    beginner: {
      level: 'Beginner',
      duration: '2-3 tuần',
      color: 'green',
      icon: '🌱',
      steps: [
        {
          id: 'b1',
          title: 'Học EDA (Exploratory Data Analysis)',
          duration: '1 tuần',
          topics: [
            'Histogram, mean, median, standard deviation',
            'Phân loại biến: categorical vs numerical',
            'Boxplot để phát hiện outliers',
            'Thực hành với Tools section trong app này'
          ],
          completed: false
        },
        {
          id: 'b2',
          title: 'Hiểu Discrete Distributions',
          duration: '1 tuần',
          topics: [
            'Bernoulli: Binary outcomes',
            'Binomial: Multiple independent trials',
            'Công thức tính E[X] và Var[X]',
            'Thực hành mô phỏng trong app'
          ],
          completed: false
        },
        {
          id: 'b3',
          title: 'Làm bài tập cơ bản',
          duration: '3-4 ngày',
          topics: [
            'Tính xác suất với Bernoulli & Binomial',
            'So sánh simulation vs theoretical',
            'Hiểu khái niệm PMF',
            'Áp dụng vào bài toán thực tế đơn giản'
          ],
          completed: false
        }
      ]
    },
    intermediate: {
      level: 'Intermediate',
      duration: '3-4 tuần',
      color: 'blue',
      icon: '📚',
      steps: [
        {
          id: 'i1',
          title: 'Poisson Distribution',
          duration: '1 tuần',
          topics: [
            'Hiểu khái niệm rate parameter λ',
            'Ứng dụng: modeling rare events',
            'So sánh với Binomial khi n lớn, p nhỏ',
            'Thực hành với Poisson simulator'
          ],
          completed: false
        },
        {
          id: 'i2',
          title: 'Normal Distribution & Z-Score',
          duration: '1 tuần',
          topics: [
            'Đường cong chuẩn (bell curve)',
            'Quy tắc 68-95-99.7',
            'Chuẩn hóa dữ liệu với Z-score',
            'Sử dụng Z-Score Calculator trong app'
          ],
          completed: false
        },
        {
          id: 'i3',
          title: 'Central Limit Theorem',
          duration: '1-2 tuần',
          topics: [
            'Phát biểu và ý nghĩa của CLT',
            'Standard Error: SE = σ/√n',
            'Chạy CLT simulator với different distributions',
            'Hiểu tại sao CLT quan trọng cho ML'
          ],
          completed: false
        }
      ]
    },
    advanced: {
      level: 'Advanced',
      duration: '4-6 tuần',
      color: 'purple',
      icon: '🚀',
      steps: [
        {
          id: 'a1',
          title: 'Bayesian Statistics',
          duration: '2 tuần',
          topics: [
            'Prior, Likelihood, Posterior',
            'Bayes Theorem applications',
            'Conjugate priors',
            'Bayesian inference'
          ],
          completed: false
        },
        {
          id: 'a2',
          title: 'Maximum Likelihood Estimation',
          duration: '1 tuần',
          topics: [
            'MLE principles',
            'Log-likelihood',
            'Optimization techniques',
            'MLE trong logistic regression'
          ],
          completed: false
        },
        {
          id: 'a3',
          title: 'Hypothesis Testing & CI',
          duration: '2 tuần',
          topics: [
            'Null & Alternative hypotheses',
            'p-value interpretation',
            'Confidence intervals',
            't-test, z-test, chi-square test'
          ],
          completed: false
        }
      ]
    },
    ml: {
      level: 'ML/AI Application',
      duration: '6-8 tuần',
      color: 'red',
      icon: '🤖',
      steps: [
        {
          id: 'm1',
          title: 'Probabilistic ML Models',
          duration: '2 tuần',
          topics: [
            'Naive Bayes Classifier',
            'Logistic Regression as probability',
            'Gaussian Mixture Models',
            'Hidden Markov Models'
          ],
          completed: false
        },
        {
          id: 'm2',
          title: 'Neural Networks với Probability',
          duration: '2 tuần',
          topics: [
            'Weight initialization (Xavier/He)',
            'Dropout as Bayesian approximation',
            'Batch Normalization',
            'Cross-entropy loss as log-likelihood'
          ],
          completed: false
        },
        {
          id: 'm3',
          title: 'Advanced Probabilistic Models',
          duration: '2 tuần',
          topics: [
            'Variational Autoencoders (VAE)',
            'Generative Adversarial Networks (GANs)',
            'Gaussian Processes',
            'Bayesian Neural Networks'
          ],
          completed: false
        },
        {
          id: 'm4',
          title: 'Practical ML Projects',
          duration: '2 tuần',
          topics: [
            'Feature engineering với derived metrics',
            'A/B Testing with statistical tests',
            'Model uncertainty quantification',
            'Deploy models với confidence intervals'
          ],
          completed: false
        }
      ]
    }
  };

  const renderLevel = (key: string, data: any) => {
    const isExpanded = expandedLevel === key;
    
    return (
      <div key={key} className="mb-4">
        <button
          onClick={() => setExpandedLevel(isExpanded ? null : key)}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            isExpanded 
              ? `bg-${data.color}-50 border-${data.color}-500` 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{data.icon}</span>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">{data.level}</h3>
                <p className="text-sm text-gray-600">⏱️ {data.duration}</p>
              </div>
            </div>
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="mt-3 ml-4 space-y-3">
            {data.steps.map((step: PathStep, index: number) => (
              <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${data.color}-100 text-${data.color}-600 flex items-center justify-center font-bold text-sm mr-3`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">⏱️ {step.duration}</p>
                    <ul className="space-y-1">
                      {step.topics.map((topic, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🗺️ Lộ trình học tập (Learning Path)
        </h2>
        <p className="text-gray-700">
          Roadmap chi tiết từ cơ bản đến nâng cao, giúp bạn có nền tảng vững chắc cho ML/AI
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(learningPath).map(([key, data]) => (
          <div key={key} className={`p-4 rounded-lg bg-${data.color}-50 border border-${data.color}-200 text-center`}>
            <div className="text-3xl mb-2">{data.icon}</div>
            <div className="text-sm font-semibold text-gray-800">{data.level}</div>
            <div className="text-xs text-gray-600 mt-1">{data.duration}</div>
          </div>
        ))}
      </div>

      {/* Detailed Path */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Chi tiết từng cấp độ</h3>
        <p className="text-sm text-gray-600 mb-6">
          Click vào mỗi cấp độ để xem chi tiết. Làm theo thứ tự từ trên xuống dưới.
        </p>
        
        {Object.entries(learningPath).map(([key, data]) => renderLevel(key, data))}
      </div>

      {/* Resources */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📚 Tài nguyên học tập</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Books */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">📖</span>
              Sách
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>📘 "Introduction to Probability" - Blitzstein & Hwang</li>
              <li>📗 "The Elements of Statistical Learning" - Hastie et al.</li>
              <li>📙 "Pattern Recognition and ML" - Christopher Bishop</li>
              <li>📕 "Probabilistic Machine Learning" - Kevin Murphy</li>
            </ul>
          </div>

          {/* Online Courses */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">🎓</span>
              Online Courses
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>🌐 Khan Academy: Probability & Statistics</li>
              <li>🌐 Coursera: "Mathematics for Machine Learning"</li>
              <li>🌐 MIT OCW: 18.05 Intro to Probability</li>
              <li>🌐 Fast.ai: Practical Deep Learning</li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">🛠️</span>
              Công cụ
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>🐍 Python: NumPy, SciPy, Pandas</li>
              <li>📊 Visualization: Matplotlib, Seaborn</li>
              <li>🤖 ML: Scikit-learn, TensorFlow, PyTorch</li>
              <li>📓 Jupyter Notebooks</li>
            </ul>
          </div>

          {/* Practice */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">💪</span>
              Thực hành
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>🎯 Kaggle competitions & datasets</li>
              <li>🎯 LeetCode for coding practice</li>
              <li>🎯 Làm projects cá nhân</li>
              <li>🎯 Contribute to open source</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Tips để học hiệu quả
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">1️⃣</span>
            <span><strong>Học từng bước:</strong> Đừng skip bước nào. Mỗi concept là nền tảng cho concept tiếp theo.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2️⃣</span>
            <span><strong>Thực hành nhiều:</strong> Dùng app này để mô phỏng, thử nghiệm với parameters khác nhau.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3️⃣</span>
            <span><strong>Code từ đầu:</strong> Implement các distributions trong Python/R để hiểu sâu hơn.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4️⃣</span>
            <span><strong>Áp dụng vào projects:</strong> Tìm real-world datasets và apply những gì học được.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">5️⃣</span>
            <span><strong>Tham gia cộng đồng:</strong> Stack Overflow, Reddit r/MachineLearning, Discord channels.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LearningPathGuide;

