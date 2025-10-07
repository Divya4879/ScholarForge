
export enum AppStep {
  Landing = 'landing',
  Profile = 'profile',
  Topic = 'topic',
  TopicValidation = 'topic-validation',
  Outline = 'outline',
  Dashboard = 'dashboard',
  Paper = 'paper',
  Coach = 'coach',
  References = 'references',
  Resources = 'resources',
}

export interface UserProfile {
  name: string;
  academicLevel: "Bachelor's" | "Master's";
  degreeName: string;
  stream: string;
  specificTopic: string;
  excitingTopics: string;
}

export interface ResearchTopic {
  title: string;
  description: string;
}

export interface TopicValidationAnswers {
    researchQuestion: string;
    keyResearchers: string;
    novelty: string;
}

export interface OutlineSection {
  title: string;
  description: string;
  subsections?: { title: string; description: string }[];
}

export interface SectionContent {
    markdown: string;
    citations: string[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface PlagiarismReport {
    similarityScore: number;
    sources: { url: string; percentMatch: number }[];
}

export interface Project {
  userProfile: UserProfile;
  topic: ResearchTopic | null;
  suggestedTopics: ResearchTopic[];
  topicValidation?: TopicValidationAnswers;
  outline: OutlineSection[];
  progressivePaperData: {
    [sectionTitle: string]: SectionContent;
  };
  chatHistory: ChatMessage[];
  plagiarismReport: PlagiarismReport | null;
}

// For ReferenceFinder
export interface Reference {
    title: string;
    description: string;
    link: string;
    vettingInfo?: SourceVettingInfo;
    userCritique?: string;
}

export interface SourceVettingInfo {
    peerReviewStatus: string;
    authorAffiliation: string;
    publicationRecency: string;
    credibilitySummary: string;
}

export interface ReferenceResult {
    researchPapers: Reference[];
    articlesAndNews: Reference[];
    coursesAndResources: Reference[];
}

// For ResourceHub
export interface ResourceItem {
    title: string;
    description: string;
    link: string;
}

export interface ResourceResult {
    datasets: ResourceItem[];
    codeRepositories: ResourceItem[];
    toolsAndLibraries: ResourceItem[];
}
