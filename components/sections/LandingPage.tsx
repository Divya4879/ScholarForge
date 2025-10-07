import React, { useState } from 'react';
import Button from '../common/Button';
import { RightArrowIcon, BrainIcon, BookOpenIcon, MicroscopeIcon, ChatBubbleIcon, ChevronDownIcon } from '../icons/Icons';

interface LandingPageProps {
  onStart: () => void;
}

const FAQ_DATA = [
    {
        q: "Who is ScholarForge for?",
        a: "ScholarForge is designed for undergraduate (Bachelor's) and graduate (Master's) students who are undertaking significant research projects like a thesis or dissertation. If you need a tool to help you brainstorm, structure, write, and get feedback on your work, ScholarForge is your ideal AI research partner."
    },
    {
        q: "Will this write my paper for me?",
        a: "No. Our philosophy is 'AI-assisted, not AI-generated.' ScholarForge is a thinking partner. It helps you brainstorm topics, build strong outlines, and provides expert-level feedback on your writing. The core ideas, critical thinking, and final text are yours. We enhance your intellectual process, we don't replace it."
    },
    {
        q: "Is my research data kept private?",
        a: "Absolutely. Your privacy is paramount. All project data is stored locally in your browser's storage. Nothing is uploaded to a central server, ensuring your work remains confidential and entirely under your control."
    },
    {
        q: "How does the Reference Finder work?",
        a: "The Reference Finder uses a powerful AI model connected to Google Search to find relevant academic sources for your specific topic. It goes beyond simple searching by categorizing results into research papers from accredited sources, relevant news articles, and even online courses, providing a comprehensive starting point for your literature review."
    },
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href')?.substring(1);
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };


    return (
        <div className="bg-primary-dark text-content-light w-full">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-primary-dark/70 backdrop-blur-lg border-b border-content-dark/30">
                <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="text-3xl font-bold font-display">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">ScholarForge</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 font-semibold">
                        <a href="#features" onClick={handleNavClick} className="text-content-medium hover:text-content-light transition-colors duration-300">Features</a>
                        <a href="#faq" onClick={handleNavClick} className="text-content-medium hover:text-content-light transition-colors duration-300">FAQ</a>
                    </div>
                    <Button onClick={onStart} size="md">
                        Get Started
                    </Button>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-center min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-main"></div>
                    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-pink/20 rounded-full filter blur-3xl animate-subtle-pulse"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent-cyan/20 rounded-full filter blur-3xl animate-subtle-pulse" style={{animationDelay: '3s'}}></div>
                    <div className="container mx-auto relative">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">
                            Your AI Partner in Academic Research.
                        </h1>
                        <p className="text-lg md:text-xl text-content-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                            ScholarForge streamlines your academic workflow, from brainstorming innovative topics and crafting detailed outlines to refining your final draft with expert AI feedback.
                        </p>
                        <Button onClick={onStart} size="lg" className="flex items-center space-x-2 mx-auto">
                            <span>Start Your Project</span>
                            <RightArrowIcon className="w-6 h-6" />
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-primary-dark">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">A Smarter Research Workflow</h2>
                            <p className="mt-4 text-lg text-content-medium max-w-2xl mx-auto">ScholarForge provides the essential tools to structure, write, and refine your academic work.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard
                                icon={<BrainIcon />}
                                title="Tailored Topic Generation"
                                description="Input your academic profile and interests to receive unique, relevant, and innovative research topics perfectly suited to your field of study."
                            />
                            <FeatureCard
                                icon={<BookOpenIcon />}
                                title="Intelligent Outlining"
                                description="Transform your chosen topic into a comprehensive, chapter-by-chapter outline with detailed subsections, creating a robust blueprint for your paper."
                            />
                            <FeatureCard
                                icon={<MicroscopeIcon />}
                                title="Expert Draft Refinement"
                                description="Submit your draft and receive feedback from an AI trained to act like a world-class academic editor, critiquing structure, clarity, and tone."
                            />
                            <FeatureCard
                                icon={<ChatBubbleIcon />}
                                title="Context-Aware Coaching"
                                description="Your AI Guidance Coach understands your specific research topic and provides tailored advice, helping you overcome writer's block and stay motivated."
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-primary-dark">
                    <div className="container mx-auto max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {FAQ_DATA.map((item, index) => (
                                <div key={index} className="border border-content-dark/30 rounded-lg overflow-hidden bg-primary-light/30 backdrop-blur-sm">
                                    <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-content-light hover:bg-primary-light/50">
                                        <span>{item.q}</span>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-5 pt-0 text-content-medium leading-relaxed">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center bg-gradient-main">
                    <div className="container mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-pink-soft mb-6">Ready to Elevate Your Research?</h2>
                        <p className="text-lg text-content-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                            Move beyond the blank page. Start building your next great academic paper with an intelligent partner by your side.
                        </p>
                        <Button onClick={onStart} size="lg" className="flex items-center space-x-2 mx-auto">
                            <span>Get Started for Free</span>
                            <RightArrowIcon className="w-6 h-6" />
                        </Button>
                    </div>
                </section>
            </main>
            
            {/* Footer */}
            <footer className="bg-primary-dark border-t border-content-dark/20 py-8">
                <div className="container mx-auto px-6 text-center text-content-medium">
                    &copy; {new Date().getFullYear()} ScholarForge. Empowering the next generation of researchers.
                </div>
            </footer>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactElement<{ className?: string }>;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="bg-primary-light/40 backdrop-blur-xl border border-content-dark/30 shadow-lg shadow-black/30 rounded-xl p-6 transition-all duration-300 hover:border-accent-cyan/30 hover:-translate-y-2">
            <div className="mb-5 inline-block p-3 bg-gradient-to-br from-accent-pink to-accent-cyan rounded-lg text-white">
                {React.cloneElement(icon, { className: 'w-8 h-8' })}
            </div>
            <h3 className="text-xl font-bold font-display text-content-light mb-2">{title}</h3>
            <p className="text-content-medium leading-relaxed">{description}</p>
        </div>
    );
};

export default LandingPage;