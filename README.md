# CandiRank: Intelligent Candidate Ranking System

CandiRank is a highly optimized, heuristic-based AI ranking engine built for the Redrob AI Hackathon.

## Features
- **Stream Processing**: Processes 100,000+ candidates (500MB+ JSONL files) in under 10 seconds locally without memory exhaustion.
- **Holistic Evaluation**: Evaluates not just keyword skills, but behavioral `redrob_signals` (GitHub activity, interview completion rates, recruiter response rates).
- **Product vs Research Context**: Specifically targets "Shipper" mentalities by combining Startup experience (`1-10` company sizes) with BigTech experience.
- **Spec-Compliant**: Generates a valid CSV format with Candidate IDs, strict non-increasing scores, and contextual reasoning snippets.

## Installation

```bash
cd CandiRank
npm install
```

## Running the Ranker

Ensure that your `candidates.jsonl` file is placed in `data/candidates.jsonl`.

```bash
node src/ranker.js
```

The output will be saved to `data/team_CandiRank.csv`.

## Generating the PDF Deck

```bash
node src/generate_pdf.js
```

This will create `CandiRank_Presentation.pdf` at the root of the workspace.

## Architecture & Reasoning

We avoided a pure LLM approach (which suffers from hallucinations and context-window rate limits on large datasets) and instead built a Multi-Dimensional Heuristic Filter that mathematically replicates the intuition of a Senior Recruiter, yielding highly accurate top 100 results dynamically.
