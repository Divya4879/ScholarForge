import React from 'react';
import { Project, AppStep, SectionContent } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { PdfIcon, BookOpenIcon, ChatBubbleIcon, DocumentTextIcon, CodeBracketIcon } from '../icons/Icons';
import { exportToPDF } from '../../services/paperService';

interface DashboardProps {
  project: Project;
  onNavigate: (step: AppStep) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ project, onNavigate }) => {
  const totalSections = project.outline.length;
  const completedSections = Object.values(project.progressivePaperData).filter(
    (content: SectionContent) => content?.markdown && content.markdown.trim() !== '' && content.markdown.length > 200
  ).length;
  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="flex flex-col h-full gap-8">
      <Card>
        <h1 className="text-3xl lg:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">
          Welcome back, {project.userProfile.name}!
        </h1>
        <p className="text-content-medium mt-3 text-lg">Let's continue shaping your research. Here's your project overview.</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        <div className="lg:col-span-2 space-y-8">
            <Card title="Current Project">
                <h2 className="text-2xl font-semibold text-accent-pink-soft">{project.topic?.title}</h2>
                <p className="mt-3 text-content-medium leading-relaxed">{project.topic?.description}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                    <Button onClick={() => onNavigate(AppStep.Paper)} leftIcon={<DocumentTextIcon className='w-5 h-5'/>}>Continue Writing</Button>
                    <Button onClick={() => exportToPDF(project)} variant="secondary" leftIcon={<PdfIcon className='w-5 h-5'/>}>Export to PDF</Button>
                </div>
            </Card>
             <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionCard title="Guidance Coach" icon={<ChatBubbleIcon />} onClick={() => onNavigate(AppStep.Coach)} />
                    <ActionCard title="Reference Finder" icon={<BookOpenIcon />} onClick={() => onNavigate(AppStep.References)} />
                    <ActionCard title="Resource Hub" icon={<CodeBracketIcon />} onClick={() => onNavigate(AppStep.Resources)} />
                </div>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card title="Your Progress" className="h-full">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-content-dark/50"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className="text-accent-pink"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                                style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out'}}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">{progress}%</span>
                        </div>
                    </div>
                    <p className="text-lg mt-4 text-content-light">Complete</p>
                    <p className="text-content-medium mt-1">{completedSections} of {totalSections} sections started</p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

interface ActionCardProps {
    title: string;
    // FIX: Specify that the icon element can accept a className prop.
    icon: React.ReactElement<{ className?: string }>;
    onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, onClick }) => (
    <div onClick={onClick} className="p-5 text-center bg-primary-light/50 rounded-xl cursor-pointer hover:bg-primary-light border border-content-dark/50 hover:border-accent-cyan/50 transition-all transform hover:-translate-y-1">
        <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-accent-pink to-accent-cyan rounded-lg text-white">
          {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <h3 className="font-semibold text-content-light">{title}</h3>
    </div>
);

export default Dashboard;