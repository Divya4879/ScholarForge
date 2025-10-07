import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { AppStep, Project, UserProfile, ResearchTopic, TopicValidationAnswers } from './types';
import { DEFAULT_OUTLINE_SECTIONS } from './constants';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/sections/LandingPage';
import ProfileForm from './components/sections/ProfileForm';
import TopicSuggestions from './components/sections/TopicSuggestions';
import TopicValidation from './components/sections/TopicValidation';
import ResearchOutline from './components/sections/ResearchOutline';
import Dashboard from './components/sections/Dashboard';
import ProgressiveResearchPaper from './components/sections/ProgressiveResearchPaper';
import GuidanceCoach from './components/sections/GuidanceCoach';
import ReferenceFinder from './components/sections/ReferenceFinder';
import ResourceHub from './components/sections/ResourceHub';
import AnimatedLoader from './components/common/AnimatedLoader';
import * as geminiService from './services/geminiService';

const initialProject: Project = {
  userProfile: {
    name: '',
    academicLevel: "Bachelor's",
    degreeName: '',
    stream: '',
    specificTopic: '',
    excitingTopics: '',
  },
  topic: null,
  suggestedTopics: [],
  outline: [],
  progressivePaperData: {},
  chatHistory: [],
  plagiarismReport: null,
};

function App() {
  const [project, setProject] = useLocalStorage<Project>('research-project', initialProject);
  const [appStep, setAppStep] = useLocalStorage<AppStep>('app-step', AppStep.Landing);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Thinking...');

  // Effect to guide user to the right step on first load or after state changes
  useEffect(() => {
    // This effect ensures that if the user reloads the page, they are sent
    // to the correct step based on their project's progress.
    if (appStep !== AppStep.Landing) {
      if (!project.userProfile.name || !project.userProfile.stream) {
        setAppStep(AppStep.Profile);
      } else if (!project.topic) {
        setAppStep(AppStep.Topic);
      }
    }
  }, [appStep, project, setAppStep]);

  const handleUpdateProject = useCallback((updatedData: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updatedData }));
  }, [setProject]);

  const handleProfileSubmit = (profile: UserProfile) => {
    handleUpdateProject({ 
        userProfile: profile,
        // Reset downstream project data if profile changes significantly
        topic: null,
        suggestedTopics: [],
        outline: [],
        progressivePaperData: {}
    });
    setAppStep(AppStep.Topic);
  };

  const handleGenerateTopics = useCallback(async () => {
    setIsLoading(true);
    setLoadingText('Generating Research Topics...');
    try {
      const generatedTopics = await geminiService.generateTopics(project.userProfile);
      handleUpdateProject({ suggestedTopics: generatedTopics });
    } catch (error) {
      console.error("Error generating topics:", error);
      alert(`Failed to generate topics: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [project.userProfile, handleUpdateProject]);

  // Auto-generate topics when entering the Topic step for the first time
  useEffect(() => {
    if (appStep === AppStep.Topic && project.userProfile.name && project.suggestedTopics.length === 0) {
      handleGenerateTopics();
    }
  }, [appStep, project.userProfile.name, project.suggestedTopics.length, handleGenerateTopics]);

  const handleSelectTopic = (topic: ResearchTopic) => {
    handleUpdateProject({ topic });
    setAppStep(AppStep.TopicValidation);
  };

  const handleTopicValidationSubmit = async (answers: TopicValidationAnswers) => {
    if (!project.topic) return;
    handleUpdateProject({ topicValidation: answers });

    setIsLoading(true);
    setLoadingText('Generating Detailed Outline...');
    try {
      const generatedOutline = await geminiService.generateOutline(project.topic, project.userProfile);
      const outline = generatedOutline.length > 0 ? generatedOutline : DEFAULT_OUTLINE_SECTIONS;
      handleUpdateProject({ outline, progressivePaperData: {} });
      setAppStep(AppStep.Outline);
    } catch (error) {
      console.error("Error generating outline:", error);
      handleUpdateProject({ outline: DEFAULT_OUTLINE_SECTIONS, progressivePaperData: {} }); // Fallback
      setAppStep(AppStep.Outline);
      alert("Failed to generate a custom outline. Using a default structure.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateOutline = async () => {
    if (!project.topic) return;
    setIsLoading(true);
    setLoadingText('Regenerating Outline...');
    try {
      const generatedOutline = await geminiService.generateOutline(project.topic, project.userProfile);
       handleUpdateProject({ outline: generatedOutline.length > 0 ? generatedOutline : DEFAULT_OUTLINE_SECTIONS });
    } catch (error) {
      console.error("Error regenerating outline:", error);
      alert("Failed to regenerate outline.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOutline = () => {
    const initialPaperData = project.outline.reduce((acc, section) => {
        // Pre-populate with a clear structure.
        acc[section.title] = { markdown: `## ${section.title}\n\n${section.description}`, citations: [] };
        return acc;
    }, {} as Project['progressivePaperData']);
    
    handleUpdateProject({ progressivePaperData: initialPaperData });
    setAppStep(AppStep.Dashboard);
};

  const renderAppContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><AnimatedLoader text={loadingText} /></div>;
    }
    
    switch (appStep) {
      case AppStep.Profile:
        return <ProfileForm onProfileSubmit={handleProfileSubmit} />;
      case AppStep.Topic:
        return <TopicSuggestions userProfile={project.userProfile} topics={project.suggestedTopics} onSelectTopic={handleSelectTopic} onGenerateTopics={handleGenerateTopics} />;
      case AppStep.TopicValidation:
        return project.topic && <TopicValidation topic={project.topic} onSubmit={handleTopicValidationSubmit} />;
      case AppStep.Outline:
        return project.topic && <ResearchOutline topic={project.topic} outline={project.outline} onConfirmOutline={handleConfirmOutline} onGenerateOutline={handleGenerateOutline}/>;
      case AppStep.Dashboard:
        return <Dashboard project={project} onNavigate={setAppStep} />;
      case AppStep.Paper:
        return <ProgressiveResearchPaper project={project} onUpdateProject={handleUpdateProject} />;
      case AppStep.Coach:
        return <GuidanceCoach project={project} onUpdateProject={handleUpdateProject} />;
      case AppStep.References:
        return <ReferenceFinder project={project} />;
      case AppStep.Resources:
        return <ResourceHub project={project} />;
      default:
        return <Dashboard project={project} onNavigate={setAppStep} />;
    }
  };
  
  if (appStep === AppStep.Landing) {
    return <LandingPage onStart={() => setAppStep(AppStep.Profile)} />;
  }

  return (
    <MainLayout
      appStep={appStep}
      setAppStep={setAppStep}
      project={project}
    >
      {renderAppContent()}
    </MainLayout>
  );
}

export default App;