import React from 'react';
import { AppStep, Project } from '../../types';
import { EditIcon, HomeIcon, LightbulbIcon, ListIcon, DocumentTextIcon, ChatBubbleIcon, BookOpenIcon, CloseIcon, CodeBracketIcon } from '../icons/Icons';
import Button from '../common/Button';

interface SidebarProps {
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onNavigate, project, isOpen, onClose }) => {
  
  const navItems = [
    { step: AppStep.Dashboard, label: 'Dashboard', icon: <HomeIcon />, enabled: !!project.topic },
    { step: AppStep.Topic, label: 'Topic Selection', icon: <LightbulbIcon />, enabled: true },
    { step: AppStep.Outline, label: 'Outline', icon: <ListIcon />, enabled: !!project.topic },
    { step: AppStep.Paper, label: 'Research Paper', icon: <DocumentTextIcon />, enabled: project.outline.length > 0 },
    { step: AppStep.Coach, label: 'Guidance Coach', icon: <ChatBubbleIcon />, enabled: !!project.topic },
    { step: AppStep.References, label: 'Reference Finder', icon: <BookOpenIcon />, enabled: !!project.topic },
    { step: AppStep.Resources, label: 'Resource Hub', icon: <CodeBracketIcon />, enabled: !!project.topic },
  ];

  const handleNavigation = (step: AppStep) => {
    onNavigate(step);
    onClose(); // Close sidebar on mobile after navigation
  };

  const NavLink: React.FC<{item: typeof navItems[0]}> = ({item}) => {
    const isCurrent = currentStep === item.step;
    const isDisabled = !item.enabled;

    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) handleNavigation(item.step);
        }}
        className={`flex items-center space-x-4 py-3 px-4 rounded-lg transition duration-200 font-semibold
          ${isDisabled ? 'text-content-dark cursor-not-allowed' : ''}
          ${!isDisabled && isCurrent ? 'bg-accent-pink text-white shadow-lg' : ''}
          ${!isDisabled && !isCurrent ? 'text-content-medium hover:bg-primary-light/60 hover:text-content-light' : ''}
        `}
        aria-disabled={isDisabled}
      >
        {React.cloneElement(item.icon, { className: 'w-6 h-6 flex-shrink-0' })}
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 bg-primary-dark/60 backdrop-blur-2xl text-white flex flex-col border-r border-content-dark/30 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-content-dark/30">
          <div className="text-3xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">ScholarForge</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-content-medium hover:text-white">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => <NavLink key={item.step} item={item} />)}
        </nav>
        <div className="p-4 border-t border-content-dark/30">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleNavigation(AppStep.Profile)}
            leftIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;