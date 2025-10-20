# Discrete Distribution Simulator 🎲

**Công cụ học tập tương tác về Xác suất và Thống kê - Nền tảng cho AI/ML**

Ứng dụng web giúp bạn khám phá và hiểu sâu về các phân phối xác suất thông qua mô phỏng và trực quan hóa. Được thiết kế đặc biệt cho người mới bắt đầu muốn nắm vững nền tảng xác suất để áp dụng vào Machine Learning và AI.

---

## 📚 Tại sao cần học Xác suất cho AI/ML?

Xác suất là **xương sống** của Machine Learning:
- 🧠 **Neural Networks**: Sử dụng phân phối chuẩn để khởi tạo trọng số
- 🎯 **Classification**: Dự đoán xác suất thuộc mỗi lớp
- 📊 **Statistical Learning**: CLT là cơ sở của gradient descent, bootstrap
- 🔮 **Uncertainty**: Bayesian ML, Probabilistic Models
- 🎲 **Sampling**: Monte Carlo, MCMC trong Deep Learning

**Hiểu xác suất = Hiểu cách AI học và ra quyết định**

---

## 📖 Kiến thức nền tảng (Learning Path)

### 🧩 1️⃣ Cơ sở nền tảng trước xác suất

> 📚 Nguồn: Lecture Notes - EDA, Course 1.2–1.6

Trước khi học xác suất, bạn cần hiểu cách **phân tích và mô tả dữ liệu**.

#### **Phân loại biến (Variable Types)**

| Loại | Kiểu con | Ví dụ | Áp dụng trong ML |
|------|----------|-------|-------------------|
| **Định tính (Categorical)** | Nominal | Màu sắc (đỏ, xanh, vàng) | One-hot encoding cho classification |
| | Ordinal | Học lực (kém, TB, khá, giỏi) | Label encoding với thứ tự |
| **Định lượng (Numerical)** | Interval | Nhiệt độ (°C) | Normalization, standardization |
| | Ratio | Tuổi, cân nặng, thu nhập | Feature scaling, log transform |

**Tại sao quan trọng?**
- ML algorithms cần biết loại dữ liệu để xử lý đúng (encoding, scaling)
- Neural networks cần numerical input
- Decision trees có thể xử lý cả categorical và numerical

#### **Phân tích phân phối dữ liệu**

**Công cụ trực quan:**
- **Histogram**: Phân bố tần suất
- **Boxplot**: Phát hiện outliers, so sánh nhóm
- **Scatter plot**: Tìm mối quan hệ giữa 2 biến

**Thống kê mô tả:**
- **Mean (μ)**: Giá trị trung bình
- **Median**: Giá trị trung vị (bền vững với outliers)
- **Mode**: Giá trị xuất hiện nhiều nhất
- **Standard Deviation (σ)**: Độ phân tán dữ liệu

**Ứng dụng ML:**
```
Feature Engineering → EDA → Phát hiện patterns → Chọn features tốt nhất
```

#### **Phân tích quan hệ biến**

**Univariate Analysis**: Phân tích 1 biến riêng lẻ
- Phân phối
- Central tendency
- Spread

**Bivariate Analysis**: Tìm mối quan hệ giữa 2 biến
- **Correlation coefficient (r)**: -1 đến 1
  - r > 0: Tương quan dương
  - r < 0: Tương quan âm
  - r ≈ 0: Không tương quan
- **Scatter plot**: Trực quan hóa mối quan hệ

**Trong ML:**
- Feature selection: Loại bỏ features có correlation cao (multicollinearity)
- Feature engineering: Tạo features mới từ interaction

#### **Derived Metrics (Tạo chỉ số mới)**

**Ví dụ:** `BMI = weight / height²`

**Tại sao quan trọng?**
- Tạo features có ý nghĩa từ raw data
- Giảm dimensionality nhưng tăng information
- **ML Example**: Trong house price prediction:
  ```
  price_per_sqft = price / square_footage
  room_density = num_rooms / square_footage
  ```

---

### 🎲 2️⃣ Xác suất rời rạc (Discrete Probability)

> 📚 Nguồn: Course 1.7 – Discrete Probability Distributions

#### **Khái niệm cơ bản**

**Xác suất là gì?**
- Xác suất = Tần suất kỳ vọng của một sự kiện
- P(X) ∈ [0, 1]
- Tổng tất cả xác suất = 1

**Biến ngẫu nhiên (Random Variable):**
- **Rời rạc (Discrete)**: Giá trị đếm được (0, 1, 2, 3, ...)
  - Ví dụ: Số lần tung được mặt ngửa, số email nhận được
- **Liên tục (Continuous)**: Giá trị trong khoảng [a, b]
  - Ví dụ: Chiều cao, cân nặng, thời gian

#### **Phân phối Bernoulli**

**Định nghĩa:** Thí nghiệm có 2 kết quả: Thành công (1) hoặc Thất bại (0)

**Công thức:**
```
P(X = 1) = p
P(X = 0) = 1 - p
```

**Thống kê:**
- Kỳ vọng: `E[X] = p`
- Phương sai: `Var[X] = p(1-p)`

**Ứng dụng ML/AI:**
- ✅ Binary Classification (spam/not spam)
- ✅ Logistic Regression output
- ✅ Bernoulli Naive Bayes
- ✅ Neural Network với sigmoid activation

#### **Phân phối Nhị thức (Binomial)**

**Định nghĩa:** Số lần thành công trong `n` thí nghiệm Bernoulli độc lập

**Công thức:**
```
P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
```
Trong đó:
- `n`: Số lần thử
- `k`: Số lần thành công
- `p`: Xác suất thành công mỗi lần
- `C(n,k) = n! / (k!(n-k)!)`: Tổ hợp

**Thống kê:**
- Kỳ vọng: `E[X] = np`
- Phương sai: `Var[X] = np(1-p)`

**Ví dụ thực tế:**
```
Tung đồng xu 10 lần (n=10), xác suất được ngửa mỗi lần p=0.5
P(được đúng 7 lần ngửa) = C(10,7) × 0.5^7 × 0.5^3 = 0.117
```

**Ứng dụng ML/AI:**
- ✅ A/B Testing: Tính xác suất version A tốt hơn B
- ✅ Click-through rate modeling
- ✅ Ensemble methods: Số models vote cho class A
- ✅ Dropout trong Neural Networks

#### **Phân phối Poisson**

**Định nghĩa:** Số lần xảy ra sự kiện trong một khoảng thời gian/không gian cố định

**Công thức:**
```
P(X = k) = (λ^k × e^(-λ)) / k!
```
Trong đó:
- `λ` (lambda): Tỷ lệ trung bình (average rate)
- `k`: Số lần xảy ra sự kiện
- `e ≈ 2.71828`: Số Euler

**Thống kê:**
- Kỳ vọng: `E[X] = λ`
- Phương sai: `Var[X] = λ`

**Đặc điểm:** Phương sai = Kỳ vọng (Equidispersion)

**Ví dụ thực tế:**
```
Trung bình nhận 5 email/giờ (λ=5)
P(nhận đúng 3 emails trong 1 giờ) = (5^3 × e^(-5)) / 3! = 0.140
```

**Ứng dụng ML/AI:**
- ✅ Poisson Regression cho count data
- ✅ Natural Language Processing: Tần suất từ trong document
- ✅ Recommendation Systems: Số lần user interact
- ✅ Time series: Dự đoán số events trong future window

---

### 📈 3️⃣ Xác suất liên tục (Continuous Probability)

> 📚 Nguồn: Course 1.8, 1.9 – Continuous Probability Distributions

#### **Khác biệt với Rời rạc**

| Khía cạnh | Rời rạc | Liên tục |
|-----------|---------|----------|
| Giá trị | Đếm được (1, 2, 3, ...) | Vô hạn trong khoảng [a,b] |
| Hàm | PMF (Probability Mass Function) | PDF (Probability Density Function) |
| Xác suất điểm | P(X = k) có giá trị cụ thể | P(X = x) = 0 |
| Xác suất khoảng | P(X = k) | P(a ≤ X ≤ b) = Diện tích dưới đường cong |

**Lưu ý quan trọng:** 
- Với biến liên tục, xác suất tại 1 điểm = 0
- Chỉ tính được xác suất trong 1 khoảng

#### **Phân phối Chuẩn (Normal/Gaussian Distribution)**

**Đặc điểm:**
- ✅ Hình chuông (bell curve)
- ✅ Đối xứng quanh mean (μ)
- ✅ Mô tả nhiều hiện tượng tự nhiên

**Công thức PDF:**
```
f(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))
```
Trong đó:
- `μ`: Mean (trung bình)
- `σ`: Standard deviation (độ lệch chuẩn)
- `σ²`: Variance (phương sai)

**Quy tắc 68-95-99.7:**
- 68% dữ liệu nằm trong [μ - σ, μ + σ]
- 95% dữ liệu nằm trong [μ - 2σ, μ + 2σ]
- 99.7% dữ liệu nằm trong [μ - 3σ, μ + 3σ]

#### **Chuẩn hóa (Standardization) - Z-Score**

**Công thức:**
```
Z = (X - μ) / σ
```

**Tại sao cần chuẩn hóa?**
1. Đưa về phân phối chuẩn tiêu chuẩn: N(0, 1)
2. So sánh các biến có đơn vị khác nhau
3. Sử dụng Z-table để tính xác suất

**Ví dụ:**
```
Điểm thi có μ = 70, σ = 10
Bạn được 85 điểm

Z = (85 - 70) / 10 = 1.5

→ Bạn cao hơn mean 1.5 độ lệch chuẩn
→ Tra Z-table: P(Z < 1.5) = 0.9332
→ Bạn tốt hơn 93.32% sinh viên
```

#### **Tính xác suất với Z-Score**

**Bước thực hiện:**
1. Chuyển X về Z-Score
2. Tra Z-table hoặc dùng calculator
3. Tính xác suất cần tìm

**Ví dụ:** Tính P(60 < X < 80) với μ=70, σ=10
```
Z₁ = (60 - 70) / 10 = -1.0
Z₂ = (80 - 70) / 10 = 1.0

P(-1 < Z < 1) = P(Z < 1) - P(Z < -1)
              = 0.8413 - 0.1587
              = 0.6826 ≈ 68%
```

#### **Phân phối t (Student's t-distribution)**

**Khi nào dùng?**
- ❌ Không biết σ (population standard deviation)
- ❌ Cỡ mẫu nhỏ (n < 30)

**Đặc điểm:**
- Giống phân phối chuẩn nhưng **đuôi dày hơn**
- Phụ thuộc vào **degrees of freedom (df = n-1)**
- Khi n → ∞, t-distribution → Normal distribution

**Ứng dụng:**
- Confidence intervals với small samples
- t-test để kiểm định giả thuyết

**Ứng dụng ML/AI của Normal Distribution:**
- ✅ **Feature Scaling**: StandardScaler trong sklearn
- ✅ **Weight Initialization**: Xavier/He initialization
- ✅ **Gaussian Naive Bayes**
- ✅ **Gaussian Mixture Models (GMM)**
- ✅ **Variational Autoencoders (VAE)**
- ✅ **Gaussian Processes**
- ✅ **Regularization**: L2 = Gaussian prior on weights

---

### 🧮 4️⃣ Định lý Giới hạn Trung tâm (Central Limit Theorem - CLT)

> 📚 Nguồn: Course 1.10, 1.11 – CLT part 1 & 2

#### **CLT là gì?**

**Phát biểu đơn giản:**

> Khi bạn lấy nhiều mẫu ngẫu nhiên từ BẤT KỲ phân phối nào (dù lệch, không chuẩn),
> **trung bình mẫu** sẽ tuân theo phân phối chuẩn khi cỡ mẫu đủ lớn (n ≥ 30).

#### **Công thức toán học**

Cho X₁, X₂, ..., Xₙ là n mẫu độc lập từ phân phối có:
- Mean: μ
- Standard deviation: σ

Thì trung bình mẫu X̄:
```
X̄ ~ N(μ, σ/√n)
```

Hoặc chuẩn hóa:
```
Z = (X̄ - μ) / (σ/√n) ~ N(0, 1)
```

#### **Điều kỳ diệu của CLT**

**Ví dụ trực quan:**

1️⃣ **Phân phối gốc**: Lệch phải (right-skewed)
```
████
███
██
█
```

2️⃣ **Lấy 1000 mẫu, mỗi mẫu n=30**
```
Tính mean của mỗi mẫu
```

3️⃣ **Vẽ histogram của 1000 means**
```
    █
   ███
  █████
 ███████  ← Hình chuông!
█████████
```

**→ Phân phối của sample means là Normal, dù phân phối gốc không Normal!**

#### **Ví dụ tính toán**

**Bài toán:**
```
Dân số có μ = 100, σ = 15
Lấy mẫu n = 25 người
Tìm xác suất trung bình mẫu > 105?
```

**Giải:**

1. Phân phối của X̄:
```
X̄ ~ N(100, 15/√25) = N(100, 3)
```

2. Chuẩn hóa:
```
Z = (105 - 100) / 3 = 1.67
```

3. Tra Z-table:
```
P(X̄ > 105) = P(Z > 1.67) = 1 - 0.9525 = 0.0475 ≈ 4.75%
```

#### **Vai trò của cỡ mẫu (n)**

| n | σ/√n | Ý nghĩa |
|---|------|---------|
| 4 | σ/2 | Standard error giảm 1/2 |
| 16 | σ/4 | Càng nhiều mẫu → Ước lượng càng chính xác |
| 100 | σ/10 | Tăng n gấp 4 → SE giảm 1/2 |

**Standard Error (SE) = σ/√n**
- Đo độ biến động của sample mean
- SE ↓ khi n ↑ → Ước lượng tốt hơn

#### **Ứng dụng trong Thống kê**

**1. Confidence Intervals (Khoảng tin cậy)**
```
95% CI = X̄ ± 1.96 × (σ/√n)
```
→ "Ta tin 95% rằng μ nằm trong khoảng này"

**2. Hypothesis Testing (Kiểm định giả thuyết)**
```
H₀: μ = μ₀
Tính Z = (X̄ - μ₀) / (σ/√n)
Nếu |Z| > 1.96 → Reject H₀ (α = 0.05)
```

**3. Sample Size Calculation**
```
Muốn margin of error = E?
→ n = (1.96 × σ / E)²
```

#### **Tại sao CLT là chìa khóa cho AI/ML?**

**1. Gradient Descent**
```python
# Mini-batch gradient descent
# Loss trên mini-batch xấp xỉ loss trên toàn bộ dataset
for batch in data:
    loss = compute_loss(batch)  # Sample mean của losses
    gradients = compute_gradients(loss)
    update_weights(gradients)
```
→ CLT đảm bảo mini-batch loss → population loss

**2. Bootstrap & Resampling**
```
- Lấy nhiều bootstrap samples
- Tính statistic trên mỗi sample
- Phân phối của statistics → Normal (thanks to CLT)
- Tính confidence intervals
```

**3. Ensemble Learning**
```
Average predictions từ multiple models
→ CLT: Variance giảm, predictions ổn định hơn

Random Forest = Average of N decision trees
```

**4. Neural Network Training**
```
- Khởi tạo weights theo Normal distribution
- Batch Normalization: Normalize activations
- Dropout: Ensemble of sub-networks
```

**5. A/B Testing**
```
- So sánh conversion rate giữa 2 groups
- CLT cho phép dùng z-test/t-test
- Tính statistical significance
```

**6. Cross-Validation**
```
K-fold CV → K scores
Mean score ± std → Estimate model performance
CLT: Phân phối của mean score là Normal
```

#### **Điều kiện áp dụng CLT**

✅ **Cần:**
1. Các mẫu độc lập (independent)
2. Cỡ mẫu đủ lớn (thường n ≥ 30)
3. Phân phối có finite mean và variance

❌ **Không áp dụng được:**
1. Samples phụ thuộc lẫn nhau (time series cần xử lý)
2. n quá nhỏ (< 30) với phân phối lệch nhiều
3. Heavy-tailed distributions (Cauchy) không có finite variance

---

## 💻 Về ứng dụng này

### Tính năng chính

- **🎮 Mô phỏng tương tác**: Chạy Monte Carlo simulations cho 3 phân phối rời rạc:
  - **Bernoulli**: Thí nghiệm đơn với 2 kết quả (0 hoặc 1)
  - **Binomial**: Nhiều thí nghiệm độc lập với xác suất cố định
  - **Poisson**: Sự kiện xảy ra với tỷ lệ không đổi theo thời gian/không gian

- **📊 Trực quan hóa real-time**: 
  - Biểu đồ tương tác so sánh kết quả mô phỏng vs lý thuyết
  - Toggle giữa empirical và theoretical PMF
  - Điều chỉnh tham số động với sliders

- **📚 Công cụ học tập**:
  - Tooltips giải thích khái niệm
  - Tính toán real-time: Expected value, Variance
  - So sánh simulation vs toán học lý thuyết

- **🎨 Giao diện hiện đại**: Responsive, clean UI với React và TypeScript

### Công nghệ sử dụng

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Simulation**: Custom Monte Carlo algorithms

---

## 🚀 Hướng dẫn sử dụng

### Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- npm hoặc yarn

### Cài đặt

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd discrete-distribution-simulator
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Chạy development server:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt tại `http://localhost:5173`

### Build cho Production

```bash
npm run build
```

Các file build sẽ nằm trong thư mục `dist`.

### Cách sử dụng app

1. **Chọn phân phối**: Bernoulli, Binomial, hoặc Poisson
2. **Điều chỉnh tham số**: Dùng sliders và input fields
3. **Chạy mô phỏng**: Click "Run Simulation" để tạo 1000 samples
4. **Phân tích kết quả**: So sánh empirical vs theoretical
5. **Toggle views**: Bật/tắt theoretical probability mass function

---

## 📂 Cấu trúc dự án

```
├── components/              # React components
│   ├── ControlPanel.tsx    # Parameter controls & distribution selection
│   ├── SimulationChart.tsx # Chart visualization
│   ├── ResultsPanel.tsx    # Statistics & results display
│   ├── Tooltip.tsx         # Help tooltips
│   └── InfoIcon.tsx        # Information icon
├── services/               # Business logic
│   └── simulationService.ts # Distribution algorithms & calculations
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

---

## 🎓 Lộ trình học tập đề xuất

### Cấp độ Beginner (2-3 tuần)
1. ✅ Học EDA: Histogram, mean, median, standard deviation
2. ✅ Hiểu Bernoulli và Binomial
3. ✅ Thực hành với simulator này
4. ✅ Làm bài tập cơ bản về tính xác suất

### Cấp độ Intermediate (3-4 tuần)
1. ✅ Học Poisson distribution
2. ✅ Hiểu Normal distribution và Z-score
3. ✅ Nắm vững CLT
4. ✅ Áp dụng vào bài toán thực tế

### Cấp độ Advanced (4-6 tuần)
1. ✅ Học Bayesian Statistics
2. ✅ Maximum Likelihood Estimation (MLE)
3. ✅ Hypothesis Testing, Confidence Intervals
4. ✅ Áp dụng vào ML: Feature engineering, model evaluation

### Chuyển sang ML/AI (6-8 tuần)
1. ✅ Supervised Learning với probabilistic interpretation
2. ✅ Naive Bayes, Logistic Regression
3. ✅ Neural Networks: Initialization, Regularization
4. ✅ Probabilistic Models: GMM, VAE

---

## 📚 Tài nguyên học thêm

### Sách
- 📖 "Intro to Probability" - Blitzstein & Hwang
- 📖 "The Elements of Statistical Learning" - Hastie, Tibshirani, Friedman
- 📖 "Pattern Recognition and Machine Learning" - Christopher Bishop

### Online Courses
- 🎓 Khan Academy: Probability & Statistics
- 🎓 Coursera: "Mathematics for Machine Learning"
- 🎓 MIT OCW: 18.05 Introduction to Probability and Statistics

### Tools & Libraries
- 🐍 Python: NumPy, SciPy, Statsmodels
- 📊 R: Base stats, ggplot2
- 🤖 ML Libraries: Scikit-learn, TensorFlow Probability, PyTorch

---

## 🤝 Đóng góp

Contributions được hoan nghênh! Vui lòng:
1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

Dự án này là open source theo giấy phép MIT License.

---

## ✨ Kết luận

**Xác suất không chỉ là toán học trừu tượng** - nó là ngôn ngữ của AI và ML. Từ việc khởi tạo neural network weights, đến việc đánh giá model uncertainty, đến việc optimize hyperparameters - tất cả đều dựa trên nền tảng xác suất.

**Hãy bắt đầu từ simulator này**, sau đó áp dụng vào các bài toán thực tế. Chúc bạn học tốt! 🚀

---

**Made with ❤️ for ML/AI learners**
