import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import * as geminiService from '../../services/geminiService';
import Loader from '../common/Loader';
import ReactMarkdown from 'react-markdown';


interface GuidanceCoachProps {
  project: Project;
  onUpdateProject: (updatedData: Partial<Project>) => void;
}

const GuidanceCoach: React.FC<GuidanceCoachProps> = ({ project, onUpdateProject }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    "Help me start my introduction.",
    "What's a good structure for a literature review?",
    "I'm feeling stuck, can you give me some motivation?",
    "How can I improve my thesis statement?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [project.chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newHistory = [...project.chatHistory, userMessage];
    
    onUpdateProject({ chatHistory: newHistory });
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await geminiService.continueChat(newHistory, input, { topic: project.topic });
      const modelMessage: ChatMessage = { role: 'model', content: modelResponse };
      onUpdateProject({ chatHistory: [...newHistory, modelMessage] });
    } catch (error) {
      console.error("Error with chat:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      onUpdateProject({ chatHistory: [...newHistory, errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card title="Guidance Coach">
      <div className="h-[60vh] overflow-y-auto p-4 border border-content-dark/30 rounded-lg mb-6 bg-primary-light/30 flex flex-col space-y-4">
        {project.chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-4 rounded-xl prose-custom max-w-none ${msg.role === 'user' ? 'bg-accent-pink text-white rounded-br-none' : 'bg-primary-light text-content-light rounded-bl-none'}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && <div className="self-start"><Loader text="Thinking..." /></div>}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          className="flex-grow p-3 bg-primary-light/60 border border-content-dark/50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-content-light"
          placeholder="Ask for guidance..."
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading} className="rounded-l-none">
          Send
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {starterPrompts.map((prompt, i) => (
            <Button key={i} variant="ghost" size="sm" onClick={() => handleStarterPrompt(prompt)}>
                {prompt}
            </Button>
        ))}
      </div>
    </Card>
  );
};

export default GuidanceCoach;