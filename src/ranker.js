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

  // 3. Skills Match
  let matchedSkills = 0;
  const candidateSkills = (candidate.skills || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
  for (const skill of TARGET_SKILLS) {
    if (candidateSkills.some(cs => cs.includes(skill))) {
      matchedSkills++;
    }
  }
  const skillScore = (matchedSkills / TARGET_SKILLS.length) * 35;
  score += skillScore;
  if (matchedSkills >= 5) {
    reasoningParts.push(`Strong ML/AI stack match`);
  }

  // 4. Career History (Shipper vs Researcher)
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

  // 5. Redrob Behavioral Signals (CRITICAL)
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
  
  // Normalize score between 0 and 1, then scale to 100 for percentage
  let normalizedScore = score / 120; // dividing by max possible
  if (normalizedScore > 0.99) normalizedScore = 0.99;
  if (normalizedScore < 0.1) normalizedScore = 0.1;
  const percentageScore = normalizedScore * 100;

  // Format reasoning
  let reasoning = reasoningParts.join(', ') + '.';
  if (reasoning === '.') reasoning = "Meets baseline requirements but lacks strong signals.";

  return {
    candidate_id: candidate.candidate_id,
    score: percentageScore,
    reasoning: reasoning.charAt(0).toUpperCase() + reasoning.slice(1)
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

  console.log('Processing candidates...');
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const candidate = JSON.parse(line);
      const result = scoreCandidate(candidate);
      
      topCandidates.push(result);
      
      // Keep only top 150 in memory to be fast
      if (topCandidates.length > 500) {
        topCandidates.sort((a, b) => b.score - a.score);
        topCandidates = topCandidates.slice(0, 150);
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
  topCandidates.sort((a, b) => b.score - a.score);

  console.log(`Finished processing ${processed} candidates. Writing top 100...`);

  // Write top 100 to CSV
  const top100 = topCandidates.slice(0, 100);
  
  const csvLines = ['candidate_id,rank,score,reasoning'];
  top100.forEach((c, index) => {
    // Add jitter so scores are strictly non-increasing without ties
    const finalScore = (c.score - (index * 0.0001)).toFixed(2);
    // Escape quotes in reasoning
    const safeReasoning = `"${c.reasoning.replace(/"/g, '""')}"`;
    csvLines.push(`${c.candidate_id},${index + 1},${finalScore},${safeReasoning}`);
  });

  const outputPath = path.join(__dirname, '../data/team_CandiRank.csv');
  fs.writeFileSync(outputPath, csvLines.join('\n'));
  console.log(`Done! Output saved to ${outputPath}`);
}

processCandidates().catch(console.error);
