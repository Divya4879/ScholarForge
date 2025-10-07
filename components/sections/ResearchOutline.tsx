import React from 'react';
import { OutlineSection, ResearchTopic } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface ResearchOutlineProps {
  topic: ResearchTopic;
  outline: OutlineSection[];
  onConfirmOutline: () => void;
  onGenerateOutline: () => void;
}

const ResearchOutline: React.FC<ResearchOutlineProps> = ({ topic, outline, onConfirmOutline, onGenerateOutline }) => {
  return (
    <Card title="Your Research Blueprint" className="w-full">
      <div className="mb-8 p-5 bg-primary-light/50 border border-content-dark/50 rounded-lg">
        <h3 className="font-bold font-display text-xl text-accent-pink-soft">{topic.title}</h3>
        <p className="text-content-medium mt-2 leading-relaxed">{topic.description}</p>
      </div>
      <div className="space-y-8">
        {outline.map((section, index) => (
          <div key={index} className="p-4 border-l-4 border-accent-pink bg-primary-light/30 rounded-r-lg">
            <h4 className="font-semibold font-display text-lg text-content-light">{`Chapter ${index + 1}: ${section.title}`}</h4>
            <p className="text-content-medium mt-1 italic">{section.description}</p>
            {section.subsections && section.subsections.length > 0 && (
              <div className="mt-5 pl-5 space-y-4 border-l-2 border-accent-pink/20">
                {section.subsections.map((sub, subIndex) => (
                    <div key={subIndex}>
                        <h5 className="font-semibold text-accent-pink-soft/90">{sub.title}</h5>
                        <p className="text-content-medium text-sm leading-relaxed">{sub.description}</p>
                    </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-content-dark/30 flex justify-between items-center flex-wrap gap-4">
        <Button onClick={onGenerateOutline} variant="secondary">
          Re-Forge Blueprint
        </Button>
        <Button onClick={onConfirmOutline} size="lg">
          Approve Blueprint & Start Writing
        </Button>
      </div>
    </Card>
  );
};

export default ResearchOutline;