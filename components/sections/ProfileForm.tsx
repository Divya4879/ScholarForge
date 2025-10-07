
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface ProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileSubmit }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    academicLevel: "Bachelor's",
    degreeName: '',
    stream: '',
    specificTopic: '',
    excitingTopics: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.stream) {
      onProfileSubmit(profile);
    }
  };
  
  const inputStyles = "mt-2 block w-full px-4 py-3 bg-primary-light/60 border border-content-dark/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-content-light placeholder:text-content-dark transition-colors";
  const labelStyles = "block text-sm font-semibold text-content-light";
  const helpTextStyles = "mt-2 text-sm text-content-medium";

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <Card title="Craft Your Researcher Profile" className="w-full max-w-3xl">
        <p className="mb-8 text-content-medium leading-relaxed">Your profile is the blueprint for our AI. The more details you provide, the more tailored and insightful its suggestions will be.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <label htmlFor="name" className={labelStyles}>Full Name<span className="text-accent-pink">*</span></label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className={inputStyles} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="academicLevel" className={labelStyles}>Educational Degree<span className="text-accent-pink">*</span></label>
              <select id="academicLevel" name="academicLevel" value={profile.academicLevel} onChange={handleChange} className={inputStyles}>
                <option>Bachelor's</option>
                <option>Master's</option>
              </select>
            </div>
            <div>
              <label htmlFor="degreeName" className={labelStyles}>Degree Name (Optional)</label>
              <input type="text" id="degreeName" name="degreeName" value={profile.degreeName} onChange={handleChange} className={inputStyles} placeholder="e.g., B.Tech, M.Sc." />
            </div>
          </div>

          <div>
            <label htmlFor="stream" className={labelStyles}>Branch / Stream<span className="text-accent-pink">*</span></label>
            <input type="text" id="stream" name="stream" value={profile.stream} onChange={handleChange} className={inputStyles} placeholder="e.g., Computer Science Engineering" required />
            <p className={helpTextStyles}>Your primary academic discipline or major.</p>
          </div>

          <div>
            <label htmlFor="specificTopic" className={labelStyles}>Specific Topic of Interest (Optional)</label>
            <input type="text" id="specificTopic" name="specificTopic" value={profile.specificTopic} onChange={handleChange} className={inputStyles} placeholder="e.g., 'Reinforcement learning for robotics'" />
            <p className={helpTextStyles}>If you have a particular idea in mind, mention it here.</p>
          </div>

          <div>
            <label htmlFor="excitingTopics" className={labelStyles}>What topics excite you? (Optional)</label>
            <textarea id="excitingTopics" name="excitingTopics" value={profile.excitingTopics} onChange={handleChange} rows={3} className={inputStyles} placeholder="e.g., 'I'm fascinated by AI ethics, sustainable energy, and 18th-century literature.'"></textarea>
            <p className={helpTextStyles}>Mention any subjects you're passionate about. This helps the AI discover unique, interdisciplinary topic ideas for you.</p>
          </div>

          <div className="text-right pt-4">
            <Button type="submit" size="lg">
              Forge My Research Topics
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileForm;