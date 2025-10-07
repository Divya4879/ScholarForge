import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { AppStep, Project } from '../../types';
import { MenuIcon } from '../icons/Icons';

interface MainLayoutProps {
  children: React.ReactNode;
  appStep: AppStep;
  setAppStep: (step: AppStep) => void;
  project: Project;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, appStep, setAppStep, project }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-main text-content-light font-sans">
      <Sidebar 
        currentStep={appStep} 
        onNavigate={setAppStep} 
        project={project}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 w-full">
        {/* Top Header for Mobile */}
        <header className="lg:hidden h-24 flex items-center justify-between px-6 bg-primary-dark/70 backdrop-blur-lg border-b border-content-dark/30 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-content-medium hover:text-white">
            <MenuIcon className="w-8 h-8" />
          </button>
          <div className="text-2xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">ScholarForge</span>
          </div>
          <div className="w-8"></div> 
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;