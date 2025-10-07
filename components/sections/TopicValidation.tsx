
import React, { useState } from 'react';
import { ResearchTopic, TopicValidationAnswers } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface TopicValidationProps {
  topic: ResearchTopic;
  onSubmit: (answers: TopicValidationAnswers) => void;
}

const TopicValidation: React.FC<TopicValidationProps> = ({ topic, onSubmit }) => {
  const [answers, setAnswers] = useState<TopicValidationAnswers>({
    researchQuestion: '',
    keyResearchers: '',
    novelty: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Add explicit type annotation to resolve type inference issue.
    if (Object.values(answers).every((answer: string) => answer.trim() !== '')) {
      onSubmit(answers);
    } else {
        alert("Please answer all questions to proceed.");
    }
  };
  
  const textAreaStyles = "mt-2 block w-full px-4 py-3 bg-primary-light/60 border border-content-dark/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-content-light placeholder:text-content-dark transition-colors";
  const labelStyles = "block text-base font-semibold text-content-light";
  const helpTextStyles = "mt-2 text-sm text-content-medium";

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <Card title="Critically Validate Your Topic" className="w-full max-w-3xl">
        <div className="mb-8 p-5 bg-primary-light/50 border border-content-dark/50 rounded-lg">
            <h3 className="font-bold font-display text-xl text-accent-pink-soft">{topic.title}</h3>
            <p className="text-content-medium mt-2 leading-relaxed">{topic.description}</p>
        </div>
        <p className="mb-8 text-content-medium leading-relaxed">Before we build the blueprint, let's ensure this foundation is solid. Answering these questions is the first step of rigorous academic work.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="researchQuestion" className={labelStyles}>What is the primary research question you want to answer?</label>
            <textarea id="researchQuestion" name="researchQuestion" value={answers.researchQuestion} onChange={handleChange} rows={3} className={textAreaStyles} placeholder="e.g., How can we mitigate algorithmic bias in AI systems used for public service delivery in India?"></textarea>
            <p className={helpTextStyles}>A good research question is specific, measurable, and focused.</p>
          </div>
          
          <div>
            <label htmlFor="keyResearchers" className={labelStyles}>Who are the key researchers or what are the seminal papers in this subfield?</label>
            <textarea id="keyResearchers" name="keyResearchers" value={answers.keyResearchers} onChange={handleChange} rows={3} className={textAreaStyles} placeholder="e.g., Timnit Gebru, Joy Buolamwini, or the paper 'Gender Shades' are foundational in AI fairness."></textarea>
            <p className={helpTextStyles}>Knowing the existing landscape is crucial for your literature review.</p>
          </div>

          <div>
            <label htmlFor="novelty" className={labelStyles}>What makes your approach or focus novel or unique?</label>
            <textarea id="novelty" name="novelty" value={answers.novelty} onChange={handleChange} rows={3} className={textAreaStyles} placeholder="e.g., While much research focuses on Western contexts, my project will specifically analyze the socio-technical challenges of AI bias in India's public sector."></textarea>
            <p className={helpTextStyles}>Your thesis must contribute something new to the conversation. What is your unique angle?</p>
          </div>

          <div className="text-right pt-4">
            <Button type="submit" size="lg">
              Confirm &amp; Generate Outline
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TopicValidation;
