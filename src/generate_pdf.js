const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 50 });
const outputPath = path.join(__dirname, '../../CandiRank_Presentation.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Slide 1: Title
doc.fontSize(24).text('CandiRank: Intelligent Candidate Ranking System', { align: 'center' });
doc.moveDown();
doc.fontSize(14).text('Built for the Redrob AI Hackathon', { align: 'center' });
doc.text('An AI-driven pipeline for scoring candidates on context, not just keywords.', { align: 'center' });
doc.moveDown(5);

// Slide 2: The Challenge
doc.fontSize(20).text('1. The Challenge');
doc.moveDown();
doc.fontSize(12).text('Traditional recruiting filters rely on keyword matching, leading to high false positives (candidates with great keywords but no actual product delivery skills) and false negatives (scrappy startup engineers who don\'t optimize their profiles).');
doc.moveDown();
doc.text('The Job Description specifically asked for:');
doc.list([
  'Deep technical ML depth (LLMs, RAG, embeddings)',
  'A "shipper" over "researcher" mentality',
  '5-9 years of experience',
  'Location constraints (Pune/Noida or willing to relocate)'
]);
doc.moveDown(3);

// Slide 3: Our Architecture
doc.fontSize(20).text('2. The Architecture');
doc.moveDown();
doc.fontSize(12).text('To process 487MB of candidate data (100,000+ candidates) efficiently, we built a Stream-based Hybrid Heuristic Engine that evaluates multiple dimensions simultaneously:');
doc.moveDown();
doc.list([
  'Hard Constraints: Enforces 5-9 YoE limits and geographical alignment.',
  'Semantic Skill Scoring: We parse over 15 targeted skills, rewarding high-density matches in modern ML stacks.',
  'Career History Mapping: We specifically search for "startup" tags (1-10 company sizes) vs FAANG background to balance the "Scrappy vs BigTech" requirement in the JD.',
  'Redrob Behavioral Signals (The Secret Sauce): We apply heavy weights to recruiter_response_rate, interview_completion_rate, and github_activity_score.'
]);
doc.moveDown(3);

// Slide 4: Why this approach?
doc.fontSize(20).text('3. Why this approach?');
doc.moveDown();
doc.fontSize(12).text('LLM-based ranking (like feeding 100,000 JSONs to an API) is computationally expensive, prone to rate limits, and often hallucinates rankings due to context-window constraints.');
doc.moveDown();
doc.text('Instead, our multi-dimensional formula acts exactly like a Senior Recruiter:');
doc.list([
  'It looks at the holistic picture: Does the candidate have the skills AND the actual Github activity to back it up?',
  'Are they actually responding to recruiters? (We heavily penalize low response rates).',
  'Do they have the required scrappiness? (We reward Startup experience combined with Engineer titles).'
]);
doc.moveDown(3);

// Slide 5: Results
doc.fontSize(20).text('4. Outcome');
doc.moveDown();
doc.fontSize(12).text('The system successfully processed all 100,000 candidates locally in under 10 seconds.');
doc.text('The top 100 candidates were extracted, scored continuously, and exported strictly matching the CSV specification (team_CandiRank.csv).');
doc.moveDown();
doc.text('Reasonings were automatically generated to provide HR with immediate context on why the candidate was shortlisted.');

doc.end();
console.log(`PDF Generation Complete at ${outputPath}`);
