

// FIX: Removed non-existent ChatMessage from @google/genai import.
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ResearchTopic, ReferenceResult, Reference, SourceVettingInfo, ResourceResult, ChatMessage, OutlineSection } from '../types';

// FIX: Initialize Gemini AI client per guidelines.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const generateTopics = async (profile: UserProfile): Promise<ResearchTopic[]> => {
  const prompt = `
    Based on this user profile, generate 3-5 innovative and specific research topics for a thesis.
    User Profile:
    - Academic Level: ${profile.academicLevel}
    - Degree Name: ${profile.degreeName}
    - Stream/Major: ${profile.stream}
    - Specific Interests: ${profile.specificTopic}
    - Passionate About: ${profile.excitingTopics}

    The topics should be suitable for their academic level and field. Each topic must have a "title" and a "description" (2-3 sentences).
    Return the response as a JSON array of objects.
  `;

  // FIX: Use ai.models.generateContent per guidelines.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ['title', 'description'],
        }
      }
    }
  });

  const topics = JSON.parse(response.text);
  return topics || [];
};

export const generateOutline = async (topic: ResearchTopic, profile: UserProfile): Promise<OutlineSection[]> => {
    const prompt = `
        Generate a detailed, chapter-by-chapter research paper outline for a ${profile.academicLevel}-level thesis.
        
        Topic Title: "${topic.title}"
        Topic Description: "${topic.description}"
        
        The outline should include major chapters (e.g., Introduction, Literature Review, Methodology, etc.). 
        For each chapter, provide:
        1. A 'title'.
        2. A brief 'description' of what the chapter will cover.
        3. An array of 'subsections', where each subsection has its own 'title' and 'description'.
        
        Return the response as a JSON array of chapter objects.
    `;

    // FIX: Use ai.models.generateContent per guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        subsections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                },
                                required: ['title', 'description']
                            }
                        }
                    },
                    required: ['title', 'description', 'subsections']
                }
            }
        }
    });

    const outline = JSON.parse(response.text);
    return outline || [];
};

export const continueChat = async (history: ChatMessage[], prompt: string, context: { topic: ResearchTopic | null }): Promise<string> => {
    const systemInstruction = `You are an expert academic guidance coach. The user is a ${context.topic ? `student working on a thesis titled "${context.topic.title}".` : 'student working on a research project.'} Your goal is to be encouraging, ask clarifying questions, and provide helpful, actionable advice. Do not write content for the user, but guide them. Keep responses concise and friendly. Format your response using markdown.`;

    // FIX: Removed invalid GeminiChatMessage type annotation. Type inference will handle this.
    const geminiHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...geminiHistory, { role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction
        }
    });

    return response.text;
};

export const findReferences = async (topic: ResearchTopic): Promise<ReferenceResult> => {
    const prompt = `Find relevant academic sources for a research paper on the topic: "${topic.title}". 
    Categorize the results into three JSON arrays: 'researchPapers', 'articlesAndNews', and 'coursesAndResources'.
    For each item, provide a 'title', a brief 'description', and a 'link'.
    Prioritize sources from well-known academic databases (like IEEE, ACM, Google Scholar, arXiv) for 'researchPapers'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const processPrompt = `
            Based on the provided search results, please structure the information into the requested JSON format.
            Search Results:
            ${JSON.stringify(groundingChunks)}

            Required JSON structure:
            {
              "researchPapers": [{ "title": "...", "description": "...", "link": "..." }],
              "articlesAndNews": [{ "title": "...", "description": "...", "link": "..." }],
              "coursesAndResources": [{ "title": "...", "description": "...", "link": "..." }]
            }
            Create a description for each item. Ensure the links are valid URLs from the search results.
            Make sure all strings are properly escaped and the JSON is valid.
        `;
        
        const structuredResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: processPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        researchPapers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                        articlesAndNews: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                        coursesAndResources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                    }
                }
            }
        });

        let results;
        try {
            results = JSON.parse(structuredResponse.text);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw response:', structuredResponse.text);
            // Return fallback data
            return { researchPapers: [], articlesAndNews: [], coursesAndResources: [] };
        }

        return results || { researchPapers: [], articlesAndNews: [], coursesAndResources: [] };
    } catch (error) {
        console.error('Error in findReferences:', error);
        return { researchPapers: [], articlesAndNews: [], coursesAndResources: [] };
    }
};

export const vetSource = async (ref: Reference): Promise<SourceVettingInfo> => {
    const prompt = `
        Analyze the academic credibility of the source found at this link: ${ref.link}.
        The source is titled: "${ref.title}".
        Gather information on its peer review status, author affiliation, and publication date to assess its credibility for academic research.
    `;

    // FIX: Per guidelines, googleSearch tool cannot be used with responseMimeType or responseSchema.
    // Refactored to a two-step process: 1. Search, 2. Structure.
    const searchResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const processPrompt = `
        Based on the provided search results and analysis, please structure the information into the requested JSON format.
        Search Context:
        ${JSON.stringify(groundingChunks)}
        ${searchResponse.text}

        Provide the following information in a JSON object:
        - "peerReviewStatus": (e.g., "Peer-reviewed", "Pre-print", "Not peer-reviewed", "Uncertain").
        - "authorAffiliation": (e.g., "Well-known university", "Respected research lab", "Unknown", "Commercial entity").
        - "publicationRecency": (e.g., "Recent (last 2 years)", "Relatively recent (2-5 years)", "Older (5+ years)").
        - "credibilitySummary": A brief, one-sentence summary of the source's likely credibility for academic research.
    `;

    const structuredResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: processPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    peerReviewStatus: { type: Type.STRING },
                    authorAffiliation: { type: Type.STRING },
                    publicationRecency: { type: Type.STRING },
                    credibilitySummary: { type: Type.STRING },
                },
                required: ['peerReviewStatus', 'authorAffiliation', 'publicationRecency', 'credibilitySummary'],
            }
        },
    });
    
    const info = JSON.parse(structuredResponse.text);
    return info;
};

export const findRelevantResources = async (topic: ResearchTopic, profile: UserProfile): Promise<ResourceResult> => {
    const prompt = `
        For a ${profile.academicLevel} student in ${profile.stream} researching "${topic.title}", find relevant technical resources. 
        Use Google Search to find public datasets, open-source code repositories (like on GitHub), and specific tools or software libraries.
        
        Categorize the results into three JSON arrays: 'datasets', 'codeRepositories', and 'toolsAndLibraries'.
        For each item, provide a 'title', a brief 'description' of its relevance, and a direct 'link'.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const processPrompt = `
        Based on the provided search results, structure the information into the requested JSON format.
        Search Results:
        ${JSON.stringify(groundingChunks)}

        Required JSON structure:
        {
          "datasets": [{ "title": "...", "description": "...", "link": "..." }],
          "codeRepositories": [{ "title": "...", "description": "...", "link": "..." }],
          "toolsAndLibraries": [{ "title": "...", "description": "...", "link": "..." }]
        }
        Extract relevant items from the search results and generate a title, description, and link for each.
    `;
    
    const structuredResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: processPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    datasets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                    codeRepositories: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                    toolsAndLibraries: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, link: { type: Type.STRING } }, required: ['title', 'description', 'link'] } },
                }
            }
        }
    });

    const results = JSON.parse(structuredResponse.text);
    return results || { datasets: [], codeRepositories: [], toolsAndLibraries: [] };
};

export const analyzeDraftSection = async (sectionContent: string, sectionTitle: string, topic: ResearchTopic, analysisPrompt: string): Promise<string> => {
    const prompt = `
        As an expert academic editor, please analyze a section of a research paper.
        
        Research Topic: "${topic.title}"
        Current Section: "${sectionTitle}"
        
        User's Request: "${analysisPrompt}"
        
        Here is the draft of the section:
        ---
        ${sectionContent}
        ---
        
        Provide your feedback based on the user's request. Format your response using markdown.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};

export const generateChapterContent = async (
    section: OutlineSection, 
    topic: ResearchTopic, 
    profile: UserProfile,
    existingContent?: string
): Promise<string> => {
    // Check if existingContent contains user feedback/instructions
    const hasFeedback = existingContent?.includes('User Feedback:') || existingContent?.includes('User Instructions:');
    
    let prompt = `
        Generate comprehensive academic content for a ${profile.academicLevel}-level research paper section.
        
        Research Topic: "${topic.title}"
        Topic Description: "${topic.description}"
        Section Title: "${section.title}"
        Section Description: "${section.description}"
        Academic Level: ${profile.academicLevel}
        Field of Study: ${profile.stream}
        
        ${existingContent ? `
        ${hasFeedback ? 'Previous Content and User Instructions:' : 'Existing Content to Build Upon:'}
        ${existingContent}
        
        ${hasFeedback ? 'Please incorporate the user feedback and instructions above when generating the content.' : ''}
        ` : ''}
        
        Generate detailed academic content that includes:
        1. Well-structured paragraphs with clear topic sentences
        2. Academic language appropriate for ${profile.academicLevel} level
        3. Logical flow and transitions between ideas
        4. Placeholder citations in format [Author, Year] where appropriate
        5. Subsection headings if the section is complex
        
        The content should be substantial (300-800 words) and ready for academic submission.
        Format the response in markdown with proper headings and structure.
        
        Do not include generic placeholders - write specific, detailed content relevant to the topic.
        ${hasFeedback ? 'Make sure to address all the user feedback and instructions provided.' : ''}
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};

export const generateSubsectionContent = async (
    subsection: { title: string; description: string },
    parentSection: OutlineSection,
    topic: ResearchTopic,
    profile: UserProfile
): Promise<string> => {
    const prompt = `
        Generate detailed content for a specific subsection of a research paper.
        
        Research Topic: "${topic.title}"
        Main Section: "${parentSection.title}"
        Subsection: "${subsection.title}"
        Subsection Focus: "${subsection.description}"
        Academic Level: ${profile.academicLevel}
        
        Generate 2-4 well-developed paragraphs that:
        1. Address the specific focus of this subsection
        2. Use academic language and structure
        3. Include relevant examples or explanations
        4. Add placeholder citations [Author, Year] where needed
        5. Connect to the broader section and research topic
        
        Format in markdown. Be specific and detailed, not generic.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};

export const enhanceExistingContent = async (
    currentContent: string,
    section: OutlineSection,
    topic: ResearchTopic,
    enhancementType: 'expand' | 'improve' | 'add_citations' | 'restructure'
): Promise<string> => {
    const enhancementPrompts = {
        expand: "Expand this content with more detailed explanations, examples, and academic depth.",
        improve: "Improve the academic writing quality, clarity, and flow of this content.",
        add_citations: "Add appropriate placeholder citations [Author, Year] throughout this content where academic sources would be needed.",
        restructure: "Restructure this content with better organization, headings, and logical flow."
    };
    
    const prompt = `
        ${enhancementPrompts[enhancementType]}
        
        Research Topic: "${topic.title}"
        Section: "${section.title}"
        
        Current Content:
        ---
        ${currentContent}
        ---
        
        Return the enhanced version in markdown format. Maintain the academic tone and ensure the content remains relevant to the research topic.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};
export const checkPlagiarism = async (text: string): Promise<any> => {
    console.log("Plagiarism check called for:", text.substring(0, 50) + "...");
    return Promise.resolve({
        similarityScore: Math.random() * 15, // Simulate a low score
        sources: [],
    });
};
