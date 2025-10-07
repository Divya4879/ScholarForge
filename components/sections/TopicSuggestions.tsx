import React from 'react';
import { ResearchTopic, UserProfile } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface TopicSuggestionsProps {
  userProfile: UserProfile;
  topics: ResearchTopic[];
  onSelectTopic: (topic: ResearchTopic) => void;
  onGenerateTopics: () => void;
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({ userProfile, topics, onSelectTopic, onGenerateTopics }) => {
  return (
    <Card title={`Tailored Topic Ideas for ${userProfile.name}`} className="w-full">
      <p className="mb-8 text-content-medium">Based on your profile, I've forged several potential research paths. Explore the suggestions below, select one to build upon, or we can brainstorm a new set.</p>
      <div className="grid md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
        {topics.map((topic, index) => (
          <div key={index} className="flex flex-col justify-between p-6 bg-primary-light/50 rounded-xl border border-content-dark/50 hover:border-accent-cyan/50 hover:bg-primary-light transition-all duration-300 transform hover:-translate-y-1">
            <div>
              <h3 className="font-bold text-lg text-accent-pink-soft">{topic.title}</h3>
              <p className="text-content-medium mt-2 text-sm leading-relaxed">{topic.description}</p>
            </div>
            <div className="text-right mt-6">
              <Button size="sm" onClick={() => onSelectTopic(topic)}>Select this Topic</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-content-dark/30 text-center">
        <Button onClick={onGenerateTopics} variant="secondary">
          Forge New Ideas
        </Button>
      </div>
    </Card>
  );
};

export default TopicSuggestions;