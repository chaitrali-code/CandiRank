# 🚀 CandiRank - AI-Powered Candidate Intelligence & Ranking Engine

> **Beyond Keywords. Ranking Talent the Way Great Recruiters Think.**

CandiRank is a high-performance candidate ranking system built for the **Redrob AI Hiring Challenge**. Unlike traditional Applicant Tracking Systems (ATS) that rely on simple keyword matching, CandiRank evaluates candidates using a multi-dimensional heuristic intelligence engine combining technical skill density, behavioral signals, recruiter heuristics, and contextual scoring to identify the best-fit talent.

---

# 📌 Problem Statement

Recruiters review hundreds of applications every day, yet many exceptional candidates are overlooked because conventional ATS platforms primarily depend on keyword matching.

Keywords alone cannot answer important questions such as:

- Is this candidate actually suitable for the role?
- Has their career consistently grown?
- Do they demonstrate ownership and learning ability?
- Are they likely to succeed in a startup or enterprise environment?
- Can recruiters trust the ranking?

CandiRank addresses these challenges through a mathematically explainable, multi-factor ranking engine.

---

# 🎯 Solution

CandiRank simulates the decision-making process of an experienced recruiter by evaluating multiple dimensions of a candidate profile instead of relying solely on resume keywords.

The system analyzes:

- Technical Skills
- Career Progression
- Startup & Enterprise Experience
- GitHub Activity
- Recruiter Engagement Signals
- Interview Completion History
- Behavioral Indicators
- Resume Quality
- Contextual Role Fit

Finally, every candidate receives:

- Overall Normalized Score
- Ranking Position
- Explainable Reasoning
- Submission-ready CSV Output

---

# 🧠 True AI Ranking Pipeline

```text
                Job Description
                       │
              Constraint Mapping
                       │
                       ▼
        [Stage 1] Candidate Streaming Processor
            (Filters 100k -> Top 300)
                       │
         Behavioral Feature Extraction
                       │
──────────────────────────────────────────

Technical Skills

Behavior Signals

Career Growth

Startup Experience

Enterprise Experience

GitHub Activity

Interview History

Recruiter Response

──────────────────────────────────────────
                       │
                       ▼
        [Stage 2] Semantic Evaluator
         (Local all-MiniLM-L6-v2 Embeddings)
                       │
                       ▼
         Dense Vector Cosine Similarity
                       │
                       ▼
      Ranked Candidate Shortlist (Top 100)
                       │
                       ▼
          CSV Submission Generator
```

---

# ✨ Features

## ⚡ High Performance Streaming Engine

- Processes **100,000+ candidate profiles**
- Handles **500MB+ JSONL datasets**
- Memory-efficient streaming architecture
- No memory exhaustion

---

## 🧠 Hybrid Heuristic Ranking

Instead of exact keyword matching, candidates are evaluated using multiple weighted factors.

### Ranking Factors

| Factor | Weight |
|---------|--------|
| Technical Skill Match | 35% |
| Career Progression | 20% |
| Behavioral Signals | 15% |
| Startup Experience | 10% |
| Enterprise Experience | 10% |
| GitHub Activity | 5% |
| Resume Quality | 5% |

---

## 📊 Behavioral Intelligence

CandiRank evaluates recruiter-centric behavioral metrics including:

- GitHub consistency
- Recruiter response rate
- Interview completion
- Professional engagement
- Learning mindset
- Ownership indicators

---

## 🚀 Career Intelligence

Instead of counting years of experience, the system understands career trajectory.

Examples include:

- Internship → Software Engineer → Senior Engineer
- Startup Founder → Product Engineer
- Research → Industry Transition

This provides a better estimate of candidate growth potential.

---

## 🎯 Startup vs Enterprise Fit

Different companies require different hiring strategies.

CandiRank identifies candidates suitable for:

- High-growth startups
- Enterprise organizations
- Product companies
- Research-focused roles

---

## 📈 Explainable AI

Every ranking is accompanied by human-readable reasoning.

Example:

```
Rank #3

Overall Score: 91.6

Reason:

✓ Strong Backend Engineering Experience
✓ Excellent Career Growth
✓ High GitHub Activity
✓ Startup Product Experience
✓ Outstanding Recruiter Engagement
```

This enables recruiters to trust the recommendations.

---

# ⚙️ Technology Stack

| Category | Technology |
|------------|------------|
| Runtime | Node.js |
| Language | JavaScript |
| Dataset | JSONL |
| Output | CSV |
| Processing | Stream API |
| AI Logic | Hybrid Heuristic Ranking |
| Performance | Memory Optimized |

---

# 📂 Project Structure

```
CandiRank
│
├── data/
│   ├── candidates.jsonl
│   ├── team_CandiRank.csv
│
├── src/
│   ├── ranker.js
│   └── generate_pdf.js
│
├── README.md
├── package.json
└── package-lock.json
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/chaitrali-code/CandiRank.git
```

Install dependencies

```bash
npm install
```

---

# ▶️ Running the True AI Pipeline

Our pipeline uses a two-stage funnel to process data instantly while still utilizing Deep Learning.

### Stage 1: The Sieve (Behavioral Filter)
```bash
node src/ranker.js
```
*Quickly streams the 100,000+ candidates and extracts the top 300 based purely on experience and behavioral metrics (bypassing RAM limits).*

### Stage 2: The Neural Network (Semantic Evaluator)
```bash
node src/ranker_semantic.js
```
*Loads a local HuggingFace embedding model (`all-MiniLM-L6-v2`) via WebAssembly, converts candidates into Dense Vectors, and calculates Cosine Similarity against the Job Description.*

The final AI output will be saved to `data/team_CandiRank.csv`.

---

# 📄 Generate Presentation PDF

```bash
node src/generate_pdf.js
```

Output

```
CandiRank_Presentation.pdf
```

---

# 📈 Performance

| Metric | Result |
|----------|---------|
| Candidate Dataset | 100,000+ |
| File Size | 500MB+ |
| Processing Time | Under 10 Seconds |
| Memory Usage | Stream Based |
| Output | Submission Ready CSV |

---

# 📋 Output Format

The generated CSV contains:

```csv
candidate_id,rank,score,reasoning
CAND_0018722,1,64.48,"Perfect experience level (6.6 years), Scrappy startup experience, active GitHub presence."
CAND_0007412,2,61.50,"Perfect experience level (7.4 years)."
CAND_0077337,3,61.12,"Perfect experience level (7 years), highly responsive."
```

Scores are guaranteed to be:

- Non-increasing
- Deterministic
- Submission compliant

---

# 🧠 Why are scores typically in the 60-70% range?

Our engine calculates a **Theoretical Maximum Score**. To achieve a 100%, a candidate must possess an impossible combination of traits:
1. Exactly 5-9 years of experience.
2. Perfect location alignment.
3. 100/100 GitHub Activity, 100% Recruiter Response Rate, and 100% Interview Completion Rate.
4. Career history at *both* a FAANG-level enterprise AND a 1-10 person startup.
5. A perfect 100% match against **all 17 specific ML tools/stacks**.

In reality, a "Unicorn" candidate might only match 6 out of 17 exact tools, and have great (but not mathematically perfect) behavioral signals. Therefore, in our highly rigorous grading system, a score of **60% - 75%** represents an absolute top-tier, 1% candidate in the real world.

---

# 🎯 Why CandiRank?

Traditional ATS systems rely on exact keyword matching.

CandiRank evaluates **candidate quality**, not just resume text.

It combines:

- Technical evaluation
- Behavioral analysis
- Career intelligence
- Recruiter heuristics
- Explainable scoring

to produce rankings recruiters can trust.

---

# 🔮 Future Scope

- Semantic Resume Embeddings
- Vector Similarity Search
- LLM-based Resume Understanding
- Recruiter AI Copilot
- Skill Knowledge Graph
- Explainable Recommendation Dashboard
- Bias Detection & Fair Ranking
- Multi-company SaaS Platform

---

# 👩‍💻 Developer

**Chaitrali Tikar**

Built for the **Redrob AI Hiring Challenge**

---

# ⭐ If you found this project interesting, consider giving it a star!
