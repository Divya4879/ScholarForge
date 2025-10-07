
import React, { useState } from 'react';
import { DRAFT_HELPER_TABS } from '../../constants';
import { ResearchTopic } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../common/Button';
import Loader from '../common/Loader';
import ReactMarkdown from 'react-markdown';

interface DraftHelperProps {
  sectionContent: string;
  sectionTitle: string;
  projectTopic: ResearchTopic;
}

const DraftHelper: React.FC<DraftHelperProps> = ({ sectionContent, sectionTitle, projectTopic }) => {
  const [activeTab, setActiveTab] = useState(DRAFT_HELPER_TABS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleAnalyze = async () => {
    const currentTab = DRAFT_HELPER_TABS.find(tab => tab.id === activeTab);
    if (!currentTab || !sectionContent.trim()) {
      alert("Please select an analysis type and write some content first.");
      return;
    }

    setIsLoading(true);
    setFeedback('');
    try {
      const result = await geminiService.analyzeDraftSection(
        sectionContent,
        sectionTitle,
        projectTopic,
        currentTab.prompt
      );
      setFeedback(result);
    } catch (error) {
      console.error("Error analyzing draft:", error);
      setFeedback("Sorry, an error occurred while analyzing your draft.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-light/40 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/40 p-6">
        <h3 className="text-xl font-bold font-display text-content-light mb-4">AI Draft Assistant</h3>
        <div className="flex border-b border-content-dark/50 mb-4 overflow-x-auto">
            {DRAFT_HELPER_TABS.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold transition-colors duration-200 -mb-px border-b-2 flex-shrink-0 ${
                activeTab === tab.id
                    ? 'text-accent-pink border-accent-pink'
                    : 'text-content-medium border-transparent hover:text-content-light hover:border-content-dark'
                }`}
            >
                {tab.title}
            </button>
            ))}
        </div>

        <div className="mb-4">
            <p className="text-content-medium text-sm">{DRAFT_HELPER_TABS.find(t => t.id === activeTab)?.prompt}</p>
        </div>
        
        <Button onClick={handleAnalyze} disabled={isLoading}>
            Analyze this Section
        </Button>
        
        <div className="mt-6">
            {isLoading && <Loader text="Analyzing..." />}
            {feedback && (
                <div className="p-4 bg-primary-dark/70 rounded-lg max-h-64 overflow-y-auto prose-custom max-w-none text-content-light">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
            )}
        </div>
    </div>
  );
};

export default DraftHelper;
