# 🚀 CandiRank - AI-Powered Candidate Intelligence & Ranking Engine

> **Beyond Keywords. Ranking Talent the Way Great Recruiters Think.**

CandiRank is an AI-powered candidate ranking system built for the **Redrob AI Hiring Challenge**. Unlike traditional Applicant Tracking Systems (ATS) that rely on keyword matching, CandiRank evaluates candidates using a hybrid intelligence engine combining semantic understanding, behavioral signals, recruiter heuristics, and contextual scoring to identify the best-fit talent.

---

# 📌 Problem Statement

Recruiters review hundreds of applications every day, yet many exceptional candidates are overlooked because conventional ATS platforms primarily depend on keyword matching.

Keywords alone cannot answer important questions such as:

- Is this candidate actually suitable for the role?
- Has their career consistently grown?
- Do they demonstrate ownership and learning ability?
- Are they likely to succeed in a startup or enterprise environment?
- Can recruiters trust the ranking?

CandiRank addresses these challenges through an explainable AI-driven ranking engine.

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

- Overall AI Score
- Ranking Position
- Explainable Reasoning
- Submission-ready CSV Output

---

# 🧠 AI Ranking Pipeline

```text
                Job Description
                       │
              Context Understanding
                       │
                       ▼
        Candidate Streaming Processor
                       │
         Feature Extraction Engine
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
          Hybrid Ranking Engine
                       │
                       ▼
          Explainable AI Scoring
                       │
                       ▼
      Ranked Candidate Shortlist
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

## 🧠 Hybrid AI Ranking

Instead of keyword matching, candidates are evaluated using multiple weighted factors.

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
│   ├── generate_pdf.js
│   ├── scorer.js
│   ├── parser.js
│   └── utils.js
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

# ▶️ Running the Ranker

Place the dataset inside

```
data/candidates.jsonl
```

Run

```bash
node src/ranker.js
```

Output

```
data/team_CandiRank.csv
```

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

| Candidate ID | Score | Reason |
|--------------|-------|--------|
| C10231 | 97.2 | Strong backend + startup ownership |
| C18342 | 95.8 | Excellent recruiter engagement |
| C09122 | 94.7 | High GitHub consistency |

Scores are guaranteed to be:

- Non-increasing
- Deterministic
- Submission compliant

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
