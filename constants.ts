
import { AppStep, OutlineSection } from './types';

export const APP_STEPS = Object.values(AppStep);

export const DEFAULT_OUTLINE_SECTIONS: OutlineSection[] = [
  { title: "Introduction", description: "Background, problem statement, research questions, and significance." },
  { title: "Literature Review", description: "Critical analysis of existing research relevant to the topic." },
  { title: "Methodology", description: "Description of the research design, data collection, and analysis methods." },
  { title: "Results", description: "Presentation of the findings from the research." },
  { title: "Discussion", description: "Interpretation of results, implications, and limitations." },
  { title: "Conclusion", description: "Summary of findings and suggestions for future research." },
  { title: "References", description: "List of all cited sources." },
  { title: "Appendices", description: "Supplementary materials (optional)." }
];

export const DRAFT_HELPER_TABS = [
  { id: 'structural', title: '🏗️ Structural Analysis', prompt: 'Analyze the structure, architecture and flow of this research paper.' },
  { id: 'methodology', title: '🔬 Methodology Critique', prompt: 'Critique the research methodology used in this paper.' },
  { id: 'writing', title: '✍️ Academic Writing Excellence', prompt: 'Assess and improve the academic writing style, clarity, and tone.' },
  { id: 'innovation', title: '💡 Research Innovation Assessment', prompt: 'Evaluate the novelty and potential impact of this research.' },
  { id: 'ethics', title: '⚖️ Research Ethics & Integrity', prompt: 'Review the paper for ethical considerations and research integrity.' }
];

export const DASHBOARD_MILESTONES = [
  "Profile Setup", "Topic Selection", "Outline Created", "Introduction",
  "Methodology", "Results/Discussion", "Conclusion", "Final Draft"
];