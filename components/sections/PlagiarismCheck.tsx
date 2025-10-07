
import React, { useState } from 'react';
import { Project } from '../../types';
import Button from '../common/Button';
import Loader from '../common/Loader';
import * as geminiService from '../../services/geminiService';

interface PlagiarismCheckProps {
  project: Project;
  onUpdateProject: (updatedData: Partial<Project>) => void;
}

const PlagiarismCheck: React.FC<PlagiarismCheckProps> = ({ project, onUpdateProject }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    setIsLoading(true);
    const fullText = Object.values(project.progressivePaperData)
      .map(section => section.markdown)
      .join('\n\n');
      
    try {
      const report = await geminiService.checkPlagiarism(fullText);
      onUpdateProject({ plagiarismReport: report });
    } catch (error) {
      console.error("Plagiarism check failed:", error);
      alert("Could not perform plagiarism check.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Plagiarism Check</h3>
      {isLoading ? (
        <Loader text="Checking for plagiarism..." />
      ) : (
        <>
          <p className="mb-4">Check your entire document for potential plagiarism against online sources.</p>
          <Button onClick={handleCheck}>Run Plagiarism Check</Button>
          {project.plagiarismReport && (
            <div className="mt-6 p-4 bg-primary-light/50 rounded-lg">
              <h4 className="font-semibold">Report Summary</h4>
              <p>Similarity Score: {project.plagiarismReport.similarityScore.toFixed(2)}%</p>
              {/* You would list sources here */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlagiarismCheck;
