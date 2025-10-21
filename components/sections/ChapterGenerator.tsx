import React, { useState } from 'react';
import { OutlineSection, ResearchTopic, UserProfile } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { SparklesIcon, PlusIcon, RefreshIcon } from '../icons/Icons';

interface ChapterGeneratorProps {
  section: OutlineSection;
  topic: ResearchTopic;
  profile: UserProfile;
  currentContent: string;
  onContentGenerated: (content: string) => void;
}

const ChapterGenerator: React.FC<ChapterGeneratorProps> = ({
  section,
  topic,
  profile,
  currentContent,
  onContentGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'full' | 'subsection' | 'enhance' | 'feedback'>('full');
  const [selectedSubsection, setSelectedSubsection] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleGenerateWithFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback or instructions for regeneration.');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await geminiService.generateChapterContent(
        section,
        topic,
        profile,
        currentContent.trim() ? `${currentContent}\n\nUser Feedback: ${feedback}` : `User Instructions: ${feedback}`
      );
      onContentGenerated(content);
      setFeedback(''); // Clear feedback after use
    } catch (error) {
      console.error('Error generating with feedback:', error);
      alert('Failed to generate content with feedback. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFullChapter = async () => {
    setIsGenerating(true);
    try {
      const content = await geminiService.generateChapterContent(
        section,
        topic,
        profile,
        currentContent.trim() ? currentContent : undefined
      );
      onContentGenerated(content);
    } catch (error) {
      console.error('Error generating chapter:', error);
      alert('Failed to generate chapter content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSubsection = async () => {
    if (!section.subsections || section.subsections.length === 0) {
      alert('No subsections available for this section.');
      return;
    }

    setIsGenerating(true);
    try {
      const subsection = section.subsections[selectedSubsection];
      const content = await geminiService.generateSubsectionContent(
        subsection,
        section,
        topic,
        profile
      );
      
      // Append to existing content
      const newContent = currentContent.trim() 
        ? `${currentContent}\n\n${content}`
        : content;
      onContentGenerated(newContent);
    } catch (error) {
      console.error('Error generating subsection:', error);
      alert('Failed to generate subsection content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceContent = async (enhancementType: 'expand' | 'improve' | 'add_citations' | 'restructure') => {
    if (!currentContent.trim()) {
      alert('Please write some content first before enhancing.');
      return;
    }

    setIsGenerating(true);
    try {
      const enhancedContent = await geminiService.enhanceExistingContent(
        currentContent,
        section,
        topic,
        enhancementType
      );
      onContentGenerated(enhancedContent);
    } catch (error) {
      console.error('Error enhancing content:', error);
      alert('Failed to enhance content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-primary-light/40 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/40 p-6">
        <Loader text="Generating content..." />
      </div>
    );
  }

  return (
    <div className="bg-primary-light/40 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/40 p-6">
      <h3 className="text-xl font-bold font-display text-content-light mb-4 flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-accent-pink" />
        AI Chapter Generator
      </h3>

      {/* Generation Type Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setGenerationType('full')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            generationType === 'full'
              ? 'bg-accent-pink text-white'
              : 'bg-primary-dark/50 text-content-medium hover:text-content-light'
          }`}
        >
          Full Chapter
        </button>
        <button
          onClick={() => setGenerationType('subsection')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            generationType === 'subsection'
              ? 'bg-accent-pink text-white'
              : 'bg-primary-dark/50 text-content-medium hover:text-content-light'
          }`}
        >
          By Subsection
        </button>
        <button
          onClick={() => setGenerationType('enhance')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            generationType === 'enhance'
              ? 'bg-accent-pink text-white'
              : 'bg-primary-dark/50 text-content-medium hover:text-content-light'
          }`}
        >
          Enhance Existing
        </button>
        <button
          onClick={() => setGenerationType('feedback')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            generationType === 'feedback'
              ? 'bg-accent-pink text-white'
              : 'bg-primary-dark/50 text-content-medium hover:text-content-light'
          }`}
        >
          Custom Instructions
        </button>
      </div>

      {/* Full Chapter Generation */}
      {generationType === 'full' && (
        <div className="space-y-4">
          <p className="text-content-medium text-sm">
            Generate comprehensive content for the entire "{section.title}" section based on your outline and research topic.
          </p>
          <Button onClick={handleGenerateFullChapter} leftIcon={<SparklesIcon />}>
            {currentContent.trim() ? 'Regenerate Full Chapter' : 'Generate Full Chapter'}
          </Button>
        </div>
      )}

      {/* Subsection Generation */}
      {generationType === 'subsection' && (
        <div className="space-y-4">
          {section.subsections && section.subsections.length > 0 ? (
            <>
              <p className="text-content-medium text-sm">
                Generate content for specific subsections step-by-step.
              </p>
              <select
                value={selectedSubsection}
                onChange={(e) => setSelectedSubsection(Number(e.target.value))}
                className="w-full p-2 bg-primary-dark/70 border border-content-dark/50 rounded-lg text-content-light"
              >
                {section.subsections.map((subsection, index) => (
                  <option key={index} value={index}>
                    {subsection.title}
                  </option>
                ))}
              </select>
              <Button onClick={handleGenerateSubsection} leftIcon={<PlusIcon />}>
                Add This Subsection
              </Button>
            </>
          ) : (
            <p className="text-content-medium text-sm">
              No subsections available for this section. Try generating the full chapter instead.
            </p>
          )}
        </div>
      )}

      {/* Content Enhancement */}
      {generationType === 'enhance' && (
        <div className="space-y-4">
          <p className="text-content-medium text-sm">
            Improve your existing content with AI assistance.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => handleEnhanceContent('expand')} 
              size="sm"
              leftIcon={<PlusIcon />}
            >
              Expand Content
            </Button>
            <Button 
              onClick={() => handleEnhanceContent('improve')} 
              size="sm"
              leftIcon={<RefreshIcon />}
            >
              Improve Writing
            </Button>
            <Button 
              onClick={() => handleEnhanceContent('add_citations')} 
              size="sm"
            >
              Add Citations
            </Button>
            <Button 
              onClick={() => handleEnhanceContent('restructure')} 
              size="sm"
            >
              Restructure
            </Button>
          </div>
        </div>
      )}

      {/* Custom Instructions/Feedback */}
      {generationType === 'feedback' && (
        <div className="space-y-4">
          <p className="text-content-medium text-sm">
            Provide specific feedback or instructions for how you want the content to be generated or improved.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Example: Make it more technical, add more examples, focus on recent research, include specific methodologies, etc."
            className="w-full h-24 p-3 bg-primary-dark/70 border border-content-dark/50 rounded-lg text-content-light resize-none focus:outline-none focus:ring-2 focus:ring-accent-cyan"
          />
          <Button onClick={handleGenerateWithFeedback} leftIcon={<SparklesIcon />}>
            Generate with Instructions
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChapterGenerator;
