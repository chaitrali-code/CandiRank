const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Job Description Requirements (Derived from job_description.docx)
const TARGET_SKILLS = [
  'llm', 'llms', 'embeddings', 'retrieval', 'ranking', 'rag', 'fine-tuning', 
  'machine learning', 'ml', 'python', 'nlp', 'pytorch', 'tensorflow', 'vector search',
  'system design', 'product', 'startup', 'deep learning', 'transformers', 'langchain',
  'data science', 'ai', 'artificial intelligence'
];

const TARGET_COMPANIES = ['google', 'meta', 'facebook', 'amazon', 'apple', 'netflix', 'microsoft', 'openai', 'deepmind'];

// ─── HONEYPOT DETECTION ─────────────────────────────────────────────────────
function isHoneypot(candidate) {
  // Check 1: Expert proficiency with 0 months duration
  const skills = candidate.skills || [];
  let expertZeroDuration = 0;
  for (const skill of skills) {
    if (skill.proficiency === 'expert' && (skill.duration_months === 0 || skill.duration_months === undefined)) {
      expertZeroDuration++;
    }
  }
  if (expertZeroDuration >= 3) return true; // 3+ expert skills with 0 months = honeypot

  // Check 2: Impossible tenure — career duration exceeds stated YoE significantly
  const yoe = candidate.profile?.years_of_experience || 0;
  const careerHistory = candidate.career_history || [];
  let totalCareerMonths = 0;
  for (const job of careerHistory) {
    totalCareerMonths += job.duration_months || 0;
  }
  const totalCareerYears = totalCareerMonths / 12;
  if (totalCareerYears > yoe * 2 && yoe > 0) return true; // Career double the stated YoE

  // Check 3: Very high skill count with very low endorsements across the board
  if (skills.length >= 10) {
    const avgEndorsements = skills.reduce((sum, s) => sum + (s.endorsements || 0), 0) / skills.length;
    const allExpert = skills.filter(s => s.proficiency === 'expert').length;
    if (allExpert >= 8 && avgEndorsements < 2) return true; // Claims expert in everything, nobody endorses
  }

  // Check 4: Impossible company tenure
  for (const job of careerHistory) {
    if (job.start_date && job.end_date) {
      const start = new Date(job.start_date);
      const end = new Date(job.end_date);
      const actualMonths = (end - start) / (1000 * 60 * 60 * 24 * 30);
      if (job.duration_months && Math.abs(actualMonths - job.duration_months) > 24) return true;
    }
  }

  return false;
}

// ─── SCORING FUNCTION ────────────────────────────────────────────────────────
function scoreCandidate(candidate) {
  // Skip honeypots immediately
  if (isHoneypot(candidate)) return null;

  let score = 0;
  let reasoningParts = [];
  let concerns = [];

  // 1. Experience Check (Target: 5-9 years per JD)
  const yoe = candidate.profile?.years_of_experience || 0;
  if (yoe >= 5 && yoe <= 9) {
    score += 20;
    reasoningParts.push(`${yoe} yrs experience (ideal for senior IC role)`);
  } else if (yoe >= 4 && yoe <= 12) {
    score += 10;
    reasoningParts.push(`${yoe} yrs experience`);
  } else {
    score -= 5;
    if (yoe < 4) concerns.push(`only ${yoe} yrs experience (JD asks 5-9)`);
    else concerns.push(`${yoe} yrs may be overqualified for IC role`);
  }

  // 2. Location Check (Pune/Noida or Relocate)
  const loc = (candidate.profile?.location || '').toLowerCase();
  const country = (candidate.profile?.country || '').toLowerCase();
  if (loc.includes('pune') || loc.includes('noida')) {
    score += 8;
    reasoningParts.push(`based in ${candidate.profile.location}`);
  } else if (candidate.redrob_signals?.willing_to_relocate) {
    score += 5;
  } else if (country === 'india') {
    score += 2;
  } else {
    concerns.push(`located in ${candidate.profile?.location || 'unknown'}, may need relocation`);
  }

  // 3. Skills — extract skill names properly (they are objects!)
  const candidateSkills = (candidate.skills || []).map(s => (s.name || '').toLowerCase());
  let matchedSkills = 0;
  let matchedSkillNames = [];
  for (const skill of TARGET_SKILLS) {
    if (candidateSkills.some(cs => cs.includes(skill))) {
      matchedSkills++;
      matchedSkillNames.push(skill);
    }
  }
  const skillScore = (matchedSkills / TARGET_SKILLS.length) * 25;
  score += skillScore;
  if (matchedSkills >= 6) {
    reasoningParts.push(`strong skill match (${matchedSkills} JD-relevant skills)`);
  } else if (matchedSkills >= 3) {
    reasoningParts.push(`partial skill match (${matchedSkills} JD-relevant skills)`);
  } else {
    concerns.push(`limited JD skill overlap (${matchedSkills} matches)`);
  }

  // 4. Skill Assessment Scores (Redrob platform assessments — very valuable!)
  const assessments = candidate.redrob_signals?.skill_assessment_scores || {};
  const assessmentKeys = Object.keys(assessments);
  if (assessmentKeys.length > 0) {
    const avgAssessment = assessmentKeys.reduce((sum, k) => sum + assessments[k], 0) / assessmentKeys.length;
    score += (avgAssessment / 100) * 10;
    if (avgAssessment >= 75) reasoningParts.push(`high assessment scores (avg ${avgAssessment.toFixed(0)}%)`);
  }

  // 5. Career History (Shipper vs Researcher)
  let hasStartup = false;
  let hasFaang = false;
  const currentTitle = (candidate.profile?.current_title || '').toLowerCase();
  for (const job of candidate.career_history || []) {
    const comp = (job.company || '').toLowerCase();
    const title = (job.title || '').toLowerCase();
    if (TARGET_COMPANIES.some(c => comp.includes(c))) hasFaang = true;
    if (job.company_size === '1-10' || job.company_size === '11-50') hasStartup = true;
    if (title.includes('engineer') && !title.includes('research')) score += 2;
  }
  if (hasStartup && hasFaang) {
    score += 8;
    reasoningParts.push(`startup + BigTech background`);
  } else if (hasStartup) {
    score += 4;
    reasoningParts.push(`startup experience (shipper profile)`);
  } else if (hasFaang) {
    score += 2;
    reasoningParts.push(`BigTech experience`);
  }

  // 6. Education
  for (const edu of candidate.education || []) {
    if (edu.tier === 'tier_1') { score += 5; reasoningParts.push(`Tier-1 education`); break; }
    else if (edu.tier === 'tier_2') { score += 3; break; }
    const field = (edu.field_of_study || '').toLowerCase();
    if (field.includes('computer') || field.includes('data') || field.includes('artificial') || field.includes('machine')) {
      score += 2;
    }
  }

  // 7. Redrob Behavioral Signals (CRITICAL — using 15+ signals now)
  const signals = candidate.redrob_signals || {};

  // Profile completeness
  const completeness = signals.profile_completeness_score || 0;
  score += (completeness / 100) * 5;

  // Open to work
  if (signals.open_to_work_flag) score += 3;
  else concerns.push(`not marked as open to work`);

  // Recruiter response rate
  const responseRate = signals.recruiter_response_rate || 0;
  score += responseRate * 12;
  if (responseRate > 0.7) reasoningParts.push(`high recruiter response rate (${(responseRate * 100).toFixed(0)}%)`);
  else if (responseRate < 0.2) concerns.push(`low recruiter response rate (${(responseRate * 100).toFixed(0)}%)`);

  // Avg response time
  const avgResponseTime = signals.avg_response_time_hours || 999;
  if (avgResponseTime < 12) score += 3;
  else if (avgResponseTime > 72) score -= 2;

  // Interview completion rate
  const interviewRate = signals.interview_completion_rate || 0;
  score += interviewRate * 8;
  if (interviewRate < 0.3) concerns.push(`low interview completion rate`);

  // Offer acceptance rate
  const offerRate = signals.offer_acceptance_rate || -1;
  if (offerRate >= 0) {
    score += offerRate * 5;
  }

  // GitHub activity
  const github = signals.github_activity_score || -1;
  if (github > 0) {
    score += (github / 100) * 8;
    if (github > 70) reasoningParts.push(`active GitHub (score: ${github})`);
  } else {
    concerns.push(`no GitHub linked`);
  }

  // Notice period
  const noticePeriod = signals.notice_period_days || 0;
  if (noticePeriod <= 30) score += 3;
  else if (noticePeriod > 90) { score -= 2; concerns.push(`${noticePeriod}-day notice period`); }

  // Saved by recruiters (social proof)
  const savedBy = signals.saved_by_recruiters_30d || 0;
  if (savedBy > 5) { score += 3; reasoningParts.push(`saved by ${savedBy} recruiters recently`); }

  // Search appearances (visibility)
  const searchAppearances = signals.search_appearance_30d || 0;
  if (searchAppearances > 10) score += 2;

  // Verification signals
  if (signals.verified_email) score += 1;
  if (signals.verified_phone) score += 1;
  if (signals.linkedin_connected) score += 1;

  // ─── NORMALIZE ──────────────────────────────────────────────────────────────
  // Theoretical max is ~130 now
  let normalizedScore = score / 130;
  if (normalizedScore > 0.99) normalizedScore = 0.99;
  if (normalizedScore < 0.05) normalizedScore = 0.05;

  // Format reasoning with concerns
  let reasoning = reasoningParts.join('; ');
  if (concerns.length > 0) {
    reasoning += '. Concerns: ' + concerns.slice(0, 2).join('; ');
  }
  if (!reasoning) reasoning = 'Meets baseline requirements.';

  return {
    candidate_id: candidate.candidate_id,
    behavioral_score: normalizedScore,
    behavioral_reasoning: reasoning,
    full_candidate: candidate
  };
}

// ─── STREAM PROCESSOR ────────────────────────────────────────────────────────
async function processCandidates() {
  const fileStream = fs.createReadStream(path.join(__dirname, '../data/candidates.jsonl'));
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let topCandidates = [];
  let processed = 0;
  let honeypots = 0;

  console.log('Stage 1: Streaming 100k candidates with honeypot detection...');
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const candidate = JSON.parse(line);
      const result = scoreCandidate(candidate);

      if (result === null) {
        honeypots++;
      } else {
        topCandidates.push(result);
      }

      if (topCandidates.length > 800) {
        topCandidates.sort((a, b) => b.behavioral_score - a.behavioral_score);
        topCandidates = topCandidates.slice(0, 300);
      }

      processed++;
      if (processed % 25000 === 0) {
        console.log(`Processed ${processed} candidates... (${honeypots} honeypots filtered)`);
      }
    } catch (e) { /* skip parse errors */ }
  }

  topCandidates.sort((a, b) => b.behavioral_score - a.behavioral_score);
  const top300 = topCandidates.slice(0, 300);

  console.log(`\nStage 1 Complete!`);
  console.log(`  Total processed: ${processed}`);
  console.log(`  Honeypots filtered: ${honeypots}`);
  console.log(`  Top 300 saved for Stage 2`);

  const jsonPath = path.join(__dirname, '../data/top_300.json');
  fs.writeFileSync(jsonPath, JSON.stringify(top300, null, 2));
  console.log(`  Output: ${jsonPath}`);
}

processCandidates().catch(console.error);
