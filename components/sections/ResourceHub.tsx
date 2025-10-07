import React, { useState } from 'react';
import { Project, ResourceResult, ResourceItem } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import * as geminiService from '../../services/geminiService';
import AnimatedLoader from '../common/AnimatedLoader';
import { CodeBracketIcon } from '../icons/Icons';

interface ResourceHubProps {
  project: Project;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ project }) => {
  const [results, setResults] = useState<ResourceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindResources = async () => {
    if (!project.topic || !project.userProfile) return;
    setIsLoading(true);
    setResults(null);
    try {
      const response = await geminiService.findRelevantResources(project.topic, project.userProfile);
      setResults(response);
    } catch (error) {
      console.error("Failed to find resources:", error);
      alert("There was an error finding resources.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const ResultSection: React.FC<{title: string, items: ResourceItem[]}> = ({title, items}) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-xl font-bold font-display text-accent-pink-soft mt-8 mb-4 border-b border-content-dark/30 pb-3">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="p-4 bg-primary-light/50 rounded-lg">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-content-light hover:underline hover:text-accent-cyan">
                            {item.title}
                        </a>
                        <p className="text-sm text-content-medium mt-1.5 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <Card title="Resource Hub">
      <p className="mb-6 text-content-medium leading-relaxed">
        Discover practical resources for your project. This tool uses AI grounded with Google Search to find relevant public datasets, open-source code repositories, and useful software libraries for your topic.
      </p>
      <div className="mb-8 p-4 bg-primary-light/50 border border-content-dark/50 rounded-lg">
        <h3 className="font-semibold text-lg text-content-light">Your Topic: {project.topic?.title}</h3>
      </div>
      <Button onClick={handleFindResources} disabled={isLoading} leftIcon={<CodeBracketIcon className="w-5 h-5"/>}>
        Find Technical Resources
      </Button>

      <div className="mt-8">
        {isLoading && <AnimatedLoader text="Scouring the web for resources..." />}
        {results && (
          <div className="p-4 bg-primary-light/30 border border-content-dark/30 rounded-lg max-h-[60vh] overflow-y-auto">
            <ResultSection title="Datasets" items={results.datasets} />
            <ResultSection title="Code Repositories" items={results.codeRepositories} />
            <ResultSection title="Tools & Libraries" items={results.toolsAndLibraries} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResourceHub;