# 🎓 Scholar Forge

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</div>

<div align="center">
  <h3>🚀 AI-Powered Research Paper Assistant for Students</h3>
  <p>Streamline your academic research journey from topic selection to final paper with intelligent AI guidance</p>
  
  <a href="https://scholarforge.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_App-success?style=for-the-badge" alt="Live Demo" />
  </a>
  
  <a href="#demo-video" target="_blank">
    <img src="https://img.shields.io/badge/📹_Demo_Video-Watch_Now-red?style=for-the-badge" alt="Demo Video" />
  </a>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Target Audience](#-target-audience)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🎥 Demo Video](#-demo-video)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

---

## ✨ Features

### 🎯 **Smart Topic Discovery**
- AI-powered research topic suggestions based on your academic profile
- Personalized recommendations for Bachelor's and Master's students
- Topic validation and refinement assistance

### 📝 **Intelligent Research Planning**
- Automated research outline generation
- Progressive paper structure development
- Section-by-section writing guidance

### 🔍 **Research Assistant Tools**
- **Reference Finder**: Discover relevant academic sources
- **Guidance Coach**: Get AI-powered writing assistance
- **Resource Hub**: Access curated research materials
- **Progress Tracking**: Monitor your research journey

### 💡 **User Experience**
- Clean, intuitive interface with dark theme
- Persistent project state with local storage
- Step-by-step guided workflow
- Real-time AI interactions

### 🔒 **Privacy & Security**
- Local data storage
- Secure API key management
- No personal data collection

---

## 🎯 Target Audience

**Perfect for:**
- 🎓 **Bachelor's Students** working on thesis projects
- 📚 **Master's Students** conducting research
- 📖 **Academic Researchers** seeking AI assistance
- ✍️ **Students** struggling with research paper structure

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** - Modern UI library with latest features
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool
- **CSS3** - Custom styling with Inter font

### **AI Integration**
- **Google Gemini AI** - Advanced language model for research assistance
- **React Markdown** - Rich text rendering

### **Development Tools**
- **Node.js** - Runtime environment
- **npm** - Package management
- **ESLint** - Code quality

### **Deployment**
- **Netlify** - Continuous deployment and hosting

---

## 🚀 Quick Start

Get Scholar Forge running in 3 simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/scholarforge.git
cd scholarforge

# 2. Install dependencies
npm install

# 3. Set up environment and start
cp .env.example .env.local
# Add your Gemini API key to .env.local
npm run dev
```

🌐 **Live Demo**: [https://scholarforge.netlify.app/](https://scholarforge.netlify.app/)

---

## ⚙️ Installation

### **Prerequisites**
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Google Gemini API Key**

### **Step-by-Step Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/scholarforge.git
   cd scholarforge
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

4. **Get Your Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Your Browser**
   Navigate to `http://localhost:3000`

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Required: Google Gemini AI API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Custom port (default: 3000)
PORT=3000
```

### **API Key Setup**

1. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add to Environment**:
   ```bash
   echo "VITE_GEMINI_API_KEY=your_key_here" >> .env.local
   ```

---

## 📱 Usage

### **Getting Started**

1. **Create Your Profile**
   - Enter your academic details
   - Specify your degree and research interests

2. **Discover Topics**
   - Get AI-generated topic suggestions
   - Validate and refine your chosen topic

3. **Build Your Outline**
   - Generate structured research outline
   - Customize sections as needed

4. **Research & Write**
   - Use the progressive paper tool
   - Get AI guidance for each section
   - Find relevant references

5. **Track Progress**
   - Monitor your research journey
   - Access all tools from the dashboard

### **Key Workflows**

```
Landing → Profile Setup → Topic Selection → Outline Creation → Research & Writing
```

---

## 🎥 Demo Video

> 📹 **Coming Soon**: Comprehensive demo video showcasing all features
> 
> *We're preparing a detailed walkthrough of Scholar Forge's capabilities. Stay tuned!*

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Getting Started**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/scholarforge.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow TypeScript best practices
   - Maintain consistent code style
   - Add comments for complex logic

4. **Test Your Changes**
   ```bash
   npm run dev
   # Test all functionality
   ```

5. **Submit a Pull Request**
   - Provide clear description
   - Reference any related issues

### **Contribution Guidelines**

- 🐛 **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- 💡 **Feature Requests**: Describe the problem and proposed solution
- 📝 **Code Style**: Follow existing patterns and TypeScript conventions
- ✅ **Testing**: Ensure your changes don't break existing functionality

### **Areas for Contribution**

- 🎨 UI/UX improvements
- 🔧 New AI features
- 📚 Documentation enhancements
- 🐛 Bug fixes and optimizations
- 🌐 Internationalization

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use, modify, and distribute
```

---

## 📞 Support

### **Need Help?**

- 📧 **Email**: support@scholarforge.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/scholarforge/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/scholarforge/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/scholarforge/wiki)

### **Community**

- ⭐ **Star this repo** if you find it helpful
- 🍴 **Fork** to contribute
- 📢 **Share** with fellow students and researchers

---

<div align="center">
  <h3>🎓 Built with ❤️ for Students by Students</h3>
  <p>Empowering academic excellence through AI-assisted research</p>
  
  <a href="https://scholarforge.netlify.app/">
    <img src="https://img.shields.io/badge/Try_Scholar_Forge-Now-success?style=for-the-badge" alt="Try Now" />
  </a>
</div>

---

<div align="center">
  <sub>Made with 🚀 by <a href="https://github.com/yourusername">Your Name</a></sub>
</div>
