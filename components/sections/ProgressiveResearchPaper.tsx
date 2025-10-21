
import React, { useState, useEffect } from 'react';
import { Project, OutlineSection, SectionContent } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { SaveIcon } from '../icons/Icons';
import DraftHelper from './DraftHelper';
import ChapterGenerator from './ChapterGenerator';

interface ProgressiveResearchPaperProps {
  project: Project;
  onUpdateProject: (updatedData: Partial<Project>) => void;
}

const ProgressiveResearchPaper: React.FC<ProgressiveResearchPaperProps> = ({ project, onUpdateProject }) => {
  const [activeSection, setActiveSection] = useState<OutlineSection | null>(project.outline[0] || null);
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (activeSection) {
      const sectionData = project.progressivePaperData[activeSection.title];
      setCurrentMarkdown(sectionData ? sectionData.markdown : '');
    }
  }, [activeSection, project.progressivePaperData]);

  const handleSave = () => {
    if (!activeSection) return;
    setIsSaving(true);
    
    const updatedSectionData: SectionContent = {
        ...(project.progressivePaperData[activeSection.title] || { citations: [] }),
        markdown: currentMarkdown
    };

    const updatedPaperData = {
        ...project.progressivePaperData,
        [activeSection.title]: updatedSectionData
    };
    
    onUpdateProject({ progressivePaperData: updatedPaperData });
    
    setTimeout(() => setIsSaving(false), 1000); // Simulate save time
  };

  const handleContentGenerated = (generatedContent: string) => {
    setCurrentMarkdown(generatedContent);
    // Auto-save the generated content
    if (activeSection) {
      const updatedSectionData: SectionContent = {
        ...(project.progressivePaperData[activeSection.title] || { citations: [] }),
        markdown: generatedContent
      };

      const updatedPaperData = {
        ...project.progressivePaperData,
        [activeSection.title]: updatedSectionData
      };
      
      onUpdateProject({ progressivePaperData: updatedPaperData });
    }
  };

  if (project.outline.length === 0) {
    return (
      <Card title="Research Paper">
        <p>Your outline has not been generated yet. Please complete the outline step first.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar with outline sections */}
      <div className="lg:w-1/3">
        <Card title="Paper Outline" className="h-full">
          <nav className="space-y-2 max-h-[80vh] overflow-y-auto">
            {project.outline.map((section) => (
              <a
                key={section.title}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSave(); // Save current work before switching
                  setActiveSection(section);
                }}
                className={`block p-3 rounded-lg font-semibold transition-colors duration-200 ${
                  activeSection?.title === section.title
                    ? 'bg-accent-pink text-white'
                    : 'bg-primary-light/50 text-content-medium hover:bg-primary-light hover:text-content-light'
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </Card>
      </div>

      {/* Main editor and AI tools */}
      <div className="lg:w-2/3 flex flex-col gap-8">
        <Card title={activeSection?.title || 'Select a Section'} className="flex-grow flex flex-col">
          <div className="flex-grow flex flex-col">
            <textarea
              value={currentMarkdown}
              onChange={(e) => setCurrentMarkdown(e.target.value)}
              className="w-full h-full flex-grow p-4 bg-primary-dark/80 rounded-lg border border-content-dark/50 focus:outline-none focus:ring-2 focus:ring-accent-cyan resize-none text-content-light"
              placeholder={`Start writing the "${activeSection?.title}" section here...`}
            />
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Button 
              onClick={() => setShowGenerator(!showGenerator)} 
              variant="secondary"
            >
              {showGenerator ? 'Hide AI Generator' : 'Show AI Generator'}
            </Button>
            <Button onClick={handleSave} leftIcon={<SaveIcon />} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Section'}
            </Button>
          </div>
        </Card>
        
        {/* AI Chapter Generator */}
        {showGenerator && activeSection && project.topic && project.userProfile && (
          <ChapterGenerator
            section={activeSection}
            topic={project.topic}
            profile={project.userProfile}
            currentContent={currentMarkdown}
            onContentGenerated={handleContentGenerated}
          />
        )}
        
        {/* Draft Helper */}
        {activeSection && project.topic && (
          <DraftHelper 
            sectionContent={currentMarkdown}
            sectionTitle={activeSection.title}
            projectTopic={project.topic}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressiveResearchPaper;
