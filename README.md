# AI Content Idea Generator Platform

A powerful web application leveraging AI to generate high-quality content ideas for blogs, videos, social media, and more.

## 🌟 Features

- **AI-Powered Ideation**: Generate innovative content ideas tailored to your niche and target audience
- **Content Calendar**: Plan and schedule your content strategy with an intuitive calendar interface
- **Trend Analysis**: Stay ahead of the curve with real-time trend data for different platforms
- **Multi-Platform Support**: Generate ideas for blogs, YouTube, TikTok, Instagram, Twitter, and more
- **Idea Management**: Save, categorize, and refine your favorite content ideas
- **Export Options**: Easily export your ideas to various formats for sharing with your team

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material UI for component library
- Axios for API requests
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB for database
- JWT authentication
- OpenAI API integration

## 📋 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/ai-content-idea-platform.git
cd ai-content-idea-platform
```

2. Install dependencies
```bash
npm run install-all
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server
```bash
npm run dev
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/dxaginfo/ai-content-idea-platform/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.