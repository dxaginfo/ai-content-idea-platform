const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate content ideas based on provided parameters
 * @param {Object} params - Parameters for idea generation
 * @returns {Promise<Array>} - Array of generated ideas
 */
exports.generateContentIdeas = async (params) => {
  try {
    const {
      contentType = 'blog',
      platform = 'all',
      theme = '',
      audience = '',
      count = 5,
      style = 'professional',
      includeKeywords = true,
      includeAudience = true,
    } = params;

    // Build the prompt
    const prompt = `Generate ${count} creative and specific ${contentType} content ideas${
      platform !== 'all' ? ` for ${platform}` : ''
    }${theme ? ` about ${theme}` : ''}${
      audience ? ` targeted at ${audience}` : ''
    }. Use a ${style} tone.
    
    For each idea, provide:
    1. A catchy title
    2. A brief description (2-3 sentences)
    3. Target audience demographics
    4. Key points to include
    5. Estimated content length or duration
    6. Relevant hashtags or keywords
    
    Format the response as JSON with the following structure:
    [{
      "title": "",
      "description": "",
      "targetAudience": [""],
      "keyPoints": [""],
      "estimatedLength": "",
      "keywords": [""]
    }]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a professional content strategist and marketer with expertise in generating engaging content ideas across various platforms." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    let ideaData = JSON.parse(response.choices[0].message.content);
    
    // Ensure we have the expected data structure
    if (!Array.isArray(ideaData.ideas) && !Array.isArray(ideaData)) {
      ideaData = { ideas: [ideaData] };
    }
    
    const ideas = Array.isArray(ideaData) ? ideaData : ideaData.ideas;

    return ideas.map(idea => ({
      ...idea,
      contentType,
      platform: platform === 'all' ? getRandomPlatform(contentType) : platform,
      isAIGenerated: true,
    }));
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw new Error('Failed to generate content ideas');
  }
};

/**
 * Generate content calendar suggestions
 * @param {Object} params - Parameters for calendar generation
 * @returns {Promise<Array>} - Array of calendar suggestions
 */
exports.generateContentCalendar = async (params) => {
  try {
    const {
      startDate,
      endDate,
      frequency = 'weekly',
      contentTypes = ['blog', 'social'],
      platforms = ['all'],
      theme = '',
    } = params;

    // Build the prompt
    const prompt = `Create a content calendar from ${startDate} to ${endDate} with ${frequency} posting frequency.
    Include content types: ${contentTypes.join(', ')}.
    Target platforms: ${platforms.join(', ')}.
    ${theme ? `Overall theme or focus: ${theme}` : ''}
    
    For each calendar entry, provide:
    1. Publication date (YYYY-MM-DD)
    2. Content title
    3. Content type
    4. Platform
    5. Brief description or angle
    6. Key points
    
    Format the response as JSON with the following structure:
    [{
      "date": "",
      "title": "",
      "contentType": "",
      "platform": "",
      "description": "",
      "keyPoints": [""]
    }]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a professional content strategist specializing in content calendar planning and optimization." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    let calendarData = JSON.parse(response.choices[0].message.content);
    
    // Ensure we have the expected data structure
    if (!Array.isArray(calendarData.calendar) && !Array.isArray(calendarData)) {
      calendarData = { calendar: [calendarData] };
    }
    
    const calendar = Array.isArray(calendarData) ? calendarData : calendarData.calendar;

    return calendar;
  } catch (error) {
    console.error('Error generating content calendar:', error);
    throw new Error('Failed to generate content calendar');
  }
};

/**
 * Analyze content trends based on keywords
 * @param {Object} params - Parameters for trend analysis
 * @returns {Promise<Object>} - Trend analysis results
 */
exports.analyzeContentTrends = async (params) => {
  try {
    const {
      keywords = [],
      contentType = 'all',
      timeframe = '3 months',
    } = params;

    // Build the prompt
    const prompt = `Analyze current content trends${
      keywords.length > 0 ? ` for these keywords: ${keywords.join(', ')}` : ''
    }${contentType !== 'all' ? ` in ${contentType} content` : ''} over the past ${timeframe}.
    
    Provide:
    1. Top trending topics
    2. Audience engagement patterns
    3. Content format preferences
    4. Predicted upcoming trends
    5. Recommendations for content strategy
    
    Format the response as JSON with the following structure:
    {
      "trendingTopics": [""],
      "engagementPatterns": [""],
      "formatPreferences": [""],
      "upcomingTrends": [""],
      "recommendations": [""]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a data analyst specializing in content trend analysis with expertise in social media and digital content performance." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing content trends:', error);
    throw new Error('Failed to analyze content trends');
  }
};

/**
 * Helper function to get a random platform based on content type
 * @param {string} contentType - Type of content
 * @returns {string} - Random platform name
 */
function getRandomPlatform(contentType) {
  const platforms = {
    blog: ['Medium', 'WordPress', 'Substack', 'LinkedIn', 'personal blog'],
    video: ['YouTube', 'TikTok', 'Instagram', 'Facebook'],
    social: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'],
    podcast: ['Spotify', 'Apple Podcasts', 'Google Podcasts', 'YouTube'],
    infographic: ['Pinterest', 'Instagram', 'LinkedIn', 'Twitter'],
    email: ['Newsletter', 'Email campaign', 'Email series'],
  };

  const platformOptions = platforms[contentType] || platforms.social;
  return platformOptions[Math.floor(Math.random() * platformOptions.length)];
}