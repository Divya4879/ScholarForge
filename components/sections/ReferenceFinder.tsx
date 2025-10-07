import React, { useState } from 'react';
import { Project, ReferenceResult, Reference, SourceVettingInfo } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import * as geminiService from '../../services/geminiService';
import AnimatedLoader from '../common/AnimatedLoader';
import { BookOpenIcon, MicroscopeIcon } from '../icons/Icons';

interface ReferenceFinderProps {
  project: Project;
}

const ReferenceFinder: React.FC<ReferenceFinderProps> = ({ project }) => {
  const [results, setResults] = useState<ReferenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vettingStatus, setVettingStatus] = useState<{ [link: string]: boolean }>({});

  const handleFindReferences = async () => {
    if (!project.topic) return;
    setIsLoading(true);
    setResults(null);
    try {
      const response = await geminiService.findReferences(project.topic);
      setResults(response);
    } catch (error) {
      console.error("Failed to find references:", error);
      alert("There was an error finding references.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVetSource = async (refToVet: Reference, category: keyof ReferenceResult) => {
    setVettingStatus(prev => ({ ...prev, [refToVet.link]: true }));
    try {
        const vettingInfo = await geminiService.vetSource(refToVet);
        setResults(prevResults => {
            if (!prevResults) return null;
            const updatedCategory = prevResults[category].map(ref => 
                ref.link === refToVet.link ? { ...ref, vettingInfo } : ref
            );
            return { ...prevResults, [category]: updatedCategory };
        });
    } catch (error) {
        console.error("Failed to vet source:", error);
        alert("An error occurred while vetting the source.");
    } finally {
        setVettingStatus(prev => ({ ...prev, [refToVet.link]: false }));
    }
  };

  const handleCritiqueChange = (critique: string, refToUpdate: Reference, category: keyof ReferenceResult) => {
    setResults(prevResults => {
        if (!prevResults) return null;
        const updatedCategory = prevResults[category].map(ref => 
            ref.link === refToUpdate.link ? { ...ref, userCritique: critique } : ref
        );
        return { ...prevResults, [category]: updatedCategory };
    });
  };
  
  const VettingInfoDisplay: React.FC<{ info: SourceVettingInfo }> = ({ info }) => (
    <div className="pt-3 text-xs">
        <h4 className="font-semibold uppercase tracking-wider text-content-medium mb-2">Credibility Analysis</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-content-light/90">
            <p><strong>Status:</strong> {info.peerReviewStatus}</p>
            <p><strong>Affiliation:</strong> {info.authorAffiliation}</p>
            <p><strong>Recency:</strong> {info.publicationRecency}</p>
        </div>
        <p className="mt-2 text-content-medium/90 italic"><strong>Summary:</strong> {info.credibilitySummary}</p>
    </div>
  );

  const ResultSection: React.FC<{title: string, references: Reference[], category: keyof ReferenceResult}> = ({title, references, category}) => {
    if (references.length === 0) return null;
    return (
        <div>
            <h3 className="text-xl font-bold font-display text-accent-pink-soft mt-8 mb-4 border-b border-content-dark/30 pb-3">{title}</h3>
            <div className="space-y-4">
                {references.map((ref, index) => (
                    <div key={index} className="p-4 bg-primary-light/50 rounded-lg transition-all duration-300">
                        <a href={ref.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-content-light hover:underline hover:text-accent-cyan">
                            {ref.title}
                        </a>
                        <p className="text-sm text-content-medium mt-1.5 leading-relaxed">{ref.description}</p>
                        
                        <div className="mt-4 pt-3 border-t border-content-dark/30">
                          {ref.vettingInfo ? (
                              <>
                                <VettingInfoDisplay info={ref.vettingInfo} />
                                <div className="mt-4 pt-4 border-t border-content-dark/30">
                                  <label htmlFor={`critique-${index}-${category}`} className="block text-sm font-semibold text-content-medium mb-2">
                                      Based on this, what are the potential limitations of using this source for your specific argument?
                                  </label>
                                  <textarea
                                      id={`critique-${index}-${category}`}
                                      value={ref.userCritique || ''}
                                      onChange={(e) => handleCritiqueChange(e.target.value, ref, category)}
                                      placeholder="e.g., The sample size is small, the methodology has known issues, or the context doesn't directly apply..."
                                      className="w-full text-sm p-2 bg-primary-dark/80 rounded border border-content-dark/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan text-content-light resize-y"
                                      rows={3}
                                  />
                                </div>
                              </>
                          ) : (
                              <div className="text-right">
                                  <Button 
                                      size="sm" 
                                      variant="secondary"
                                      onClick={() => handleVetSource(ref, category)}
                                      leftIcon={<MicroscopeIcon className="w-4 h-4" />}
                                      disabled={vettingStatus[ref.link]}
                                  >
                                      {vettingStatus[ref.link] ? 'Analyzing...' : 'Vet this Source'}
                                  </Button>
                              </div>
                          )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <Card title="Reference Finder">
      <p className="mb-6 text-content-medium leading-relaxed">
        Discover relevant sources, then use the AI-powered "Vet this Source" tool to analyze their credibility. This helps you build a stronger, more reliable literature review.
      </p>
      <div className="mb-8 p-4 bg-primary-light/50 border border-content-dark/50 rounded-lg">
        <h3 className="font-semibold text-lg text-content-light">Your Topic: {project.topic?.title}</h3>
      </div>
      <Button onClick={handleFindReferences} disabled={isLoading} leftIcon={<BookOpenIcon className="w-5 h-5" />}>
        Discover Sources
      </Button>

      <div className="mt-8">
        {isLoading && <AnimatedLoader text="Searching academic archives..." />}
        {results && (
          <div className="p-4 bg-primary-light/30 border border-content-dark/30 rounded-lg max-h-[60vh] overflow-y-auto">
            <ResultSection title="Research Papers" references={results.researchPapers} category="researchPapers" />
            <ResultSection title="Articles & News" references={results.articlesAndNews} category="articlesAndNews" />
            <ResultSection title="Courses & Resources" references={results.coursesAndResources} category="coursesAndResources" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReferenceFinder;