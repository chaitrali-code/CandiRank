const { pipeline } = require('@xenova/transformers');
const cosineSimilarity = require('compute-cosine-similarity');
const fs = require('fs');
const path = require('path');

// Full JD context for embedding
const JD_TEXT = `Senior AI Engineer for founding team at Redrob. 
We need a Shipper not a Researcher. Must have deep experience with LLMs, RAG pipelines, 
vector embeddings, semantic search, ranking systems, Python, PyTorch, and scalable ML architecture. 
Startup experience preferred. Must ship fast, iterate, and own the product end-to-end. 
Location: Pune or Noida. Experience: 5-9 years.`;

async function runSemanticRanking() {
  console.log("Stage 2: Loading Neural Network Embedding Model (Xenova/all-MiniLM-L6-v2)...");
  
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
  });

  console.log("Generating Dense Vector for Job Description...");
  const jdOutput = await extractor(JD_TEXT, { pooling: 'mean', normalize: true });
  const jdVector = Array.from(jdOutput.data);

  const top300Path = path.join(__dirname, '../data/top_300.json');
  if (!fs.existsSync(top300Path)) {
    console.error("ERROR: top_300.json not found. Run 'node src/ranker.js' first.");
    process.exit(1);
  }

  const candidates = JSON.parse(fs.readFileSync(top300Path, 'utf8'));
  console.log(`Processing ${candidates.length} candidates with Semantic Search...\n`);

  let finalRankings = [];

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const fc = c.full_candidate;

    // ─── BUILD RICH CANDIDATE TEXT ─────────────────────────────────────────
    // Use skill NAMES (not objects), title, summary, and career descriptions
    const skillNames = (fc.skills || []).map(s => s.name || '').filter(Boolean).join(', ');
    const title = fc.profile?.current_title || '';
    const headline = fc.profile?.headline || '';
    const summary = (fc.profile?.summary || '').substring(0, 300); // truncate for embedding
    
    // Get career descriptions (most recent 2 jobs)
    const careerDescs = (fc.career_history || [])
      .slice(0, 2)
      .map(j => `${j.title} at ${j.company}: ${(j.description || '').substring(0, 150)}`)
      .join('. ');

    const candidateText = `${title}. ${headline}. Skills: ${skillNames}. ${summary}. ${careerDescs}`;

    // Generate Embedding
    const candOutput = await extractor(candidateText, { pooling: 'mean', normalize: true });
    const candVector = Array.from(candOutput.data);

    // Calculate Cosine Similarity
    let similarity = cosineSimilarity(jdVector, candVector);
    if (isNaN(similarity) || similarity === null) similarity = 0.1;

    // ─── COMBINE SCORES ────────────────────────────────────────────────────
    // Weighted: 40% semantic, 60% behavioral (behavioral captures more signals now)
    const finalScore = (similarity * 0.4) + (c.behavioral_score * 0.6);

    // ─── BUILD RICH REASONING ──────────────────────────────────────────────
    let reasoningParts = [];

    // Semantic match quality
    if (similarity > 0.55) reasoningParts.push(`strong semantic alignment with JD requirements (${(similarity * 100).toFixed(0)}% match)`);
    else if (similarity > 0.40) reasoningParts.push(`moderate semantic fit for AI/ML role`);
    else reasoningParts.push(`limited direct semantic overlap with JD stack`);

    // Add behavioral reasoning
    if (c.behavioral_reasoning) {
      reasoningParts.push(c.behavioral_reasoning);
    }

    const reasoning = reasoningParts.join('; ').substring(0, 300);

    finalRankings.push({
      candidate_id: c.candidate_id,
      score: finalScore,
      reasoning: reasoning
    });

    if ((i + 1) % 50 === 0) {
      console.log(`  Embedded ${i + 1}/${candidates.length} candidates...`);
    }
  }

  // Sort by final score descending
  finalRankings.sort((a, b) => b.score - a.score);

  // Take top 100 and write CSV
  const top100 = finalRankings.slice(0, 100);

  const csvLines = ['candidate_id,rank,score,reasoning'];
  top100.forEach((c, index) => {
    // Ensure strictly non-increasing with tiny jitter
    const finalScoreStr = (c.score - (index * 0.00001)).toFixed(4);
    // Clean up reasoning
    let cleanReason = c.reasoning.replace(/,\s*$/, '');
    if (!cleanReason.endsWith('.')) cleanReason += '.';
    const safeReasoning = `"${cleanReason.replace(/"/g, '""')}"`;
    csvLines.push(`${c.candidate_id},${index + 1},${finalScoreStr},${safeReasoning}`);
  });

  const outputPath = path.join(__dirname, '../data/team_CandiRank.csv');
  fs.writeFileSync(outputPath, csvLines.join('\n'));
  console.log(`\n🎉 Stage 2 Complete! Final CSV: ${outputPath}`);
  console.log(`   Top candidate: ${top100[0].candidate_id} (score: ${top100[0].score.toFixed(4)})`);
  console.log(`   100th candidate: ${top100[99].candidate_id} (score: ${top100[99].score.toFixed(4)})`);
}

runSemanticRanking().catch(console.error);
