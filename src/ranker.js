const fs = require('fs');
const readline = require('readline');

// Job Description Requirements (Derived from job_description.docx)
const TARGET_SKILLS = [
  'llm', 'llms', 'embeddings', 'retrieval', 'ranking', 'rag', 'fine-tuning', 
  'machine learning', 'ml', 'python', 'nlp', 'pytorch', 'tensorflow', 'vector search',
  'system design', 'product', 'startup'
];

const TARGET_COMPANIES = ['google', 'meta', 'facebook', 'amazon', 'apple', 'netflix'];

// Heuristic Scoring Function
function scoreCandidate(candidate) {
  let score = 0;
  let reasoningParts = [];

  // 1. Experience Check (Target: 5-9 years)
  const yoe = candidate.profile.years_of_experience || 0;
  if (yoe >= 5 && yoe <= 9) {
    score += 25;
    reasoningParts.push(`Perfect experience level (${yoe} years)`);
  } else if (yoe >= 4 && yoe <= 10) {
    score += 15;
  } else {
    // Penalty for too junior or too senior
    score -= 10;
  }

  // 2. Location Check (Pune/Noida or Relocate)
  const loc = (candidate.profile.location || '').toLowerCase();
  if (loc.includes('pune') || loc.includes('noida')) {
    score += 10;
  } else if (candidate.redrob_signals?.willing_to_relocate) {
    score += 8;
  }

  // 3. Career History (Shipper vs Researcher)
  let hasStartup = false;
  let hasFaang = false;
  for (const job of candidate.career_history || []) {
    const comp = (job.company || '').toLowerCase();
    const title = (job.title || '').toLowerCase();
    
    if (TARGET_COMPANIES.some(c => comp.includes(c))) hasFaang = true;
    if (job.company_size === '1-10' || job.company_size === '11-50') hasStartup = true;
    
    // Bonus for product-focused titles
    if (title.includes('engineer') && !title.includes('research')) {
      score += 3; 
    }
  }
  
  if (hasStartup && hasFaang) {
    score += 10;
    reasoningParts.push(`Balanced background (Startup + BigTech)`);
  } else if (hasStartup) {
    score += 5;
    reasoningParts.push(`Scrappy startup experience`);
  } else if (hasFaang) {
    score += 2;
  }

  // 4. Redrob Behavioral Signals (CRITICAL)
  const signals = candidate.redrob_signals || {};
  
  const responseRate = signals.recruiter_response_rate || 0;
  score += responseRate * 15; 
  if (responseRate > 0.8) reasoningParts.push(`highly responsive`);

  const interviewRate = signals.interview_completion_rate || 0;
  score += interviewRate * 10;

  const github = signals.github_activity_score || -1;
  if (github > 0) {
    score += (github / 100) * 10;
    if (github > 80) reasoningParts.push(`active GitHub presence`);
  }
  
  // Normalize score out of 85 (since we removed 35 points of hardcoded skills)
  let normalizedScore = score / 85;
  if (normalizedScore > 0.99) normalizedScore = 0.99;
  if (normalizedScore < 0.1) normalizedScore = 0.1;

  return {
    candidate_id: candidate.candidate_id,
    behavioral_score: normalizedScore,
    behavioral_reasoning: reasoningParts.join(', '),
    full_candidate: candidate
  };
}

const path = require('path');

async function processCandidates() {
  const fileStream = fs.createReadStream(path.join(__dirname, '../data/candidates.jsonl'));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let topCandidates = [];
  let processed = 0;

  console.log('Stage 1: Filtering via Stream Processor...');
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const candidate = JSON.parse(line);
      const result = scoreCandidate(candidate);
      
      topCandidates.push(result);
      
      // Keep only top 800 in memory during stream
      if (topCandidates.length > 800) {
        topCandidates.sort((a, b) => b.behavioral_score - a.behavioral_score);
        topCandidates = topCandidates.slice(0, 300);
      }

      processed++;
      if (processed % 25000 === 0) {
        console.log(`Processed ${processed} candidates...`);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  // final sort
  topCandidates.sort((a, b) => b.behavioral_score - a.behavioral_score);
  const top300 = topCandidates.slice(0, 300);

  console.log(`Finished processing ${processed} candidates. Saving Top 300 to JSON...`);

  const jsonPath = path.join(__dirname, '../data/top_300.json');
  fs.writeFileSync(jsonPath, JSON.stringify(top300, null, 2));
  console.log(`Stage 1 Complete! Top 300 candidates saved to ${jsonPath}`);
}

processCandidates().catch(console.error);
