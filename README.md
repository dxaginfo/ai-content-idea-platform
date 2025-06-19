# AI Content Idea Generator Platform

A powerful web application that leverages AI to help content creators, marketers, and businesses generate, organize, and manage content ideas across multiple platforms.

## 🌟 Features

- **AI-Powered Idea Generation**: Create high-quality content ideas tailored to your industry, audience, and goals
- **Multi-Platform Support**: Generate ideas for blogs, social media, videos, podcasts, emails, and more
- **Personalized Recommendations**: Get content suggestions based on your preferences and past performance
- **Content Calendar**: Plan and schedule your content with an intuitive calendar interface
- **Trend Analysis**: Identify trending topics and content types in your industry
- **Idea Management**: Save, categorize, and track the progress of your content ideas

## 🛠️ Technology Stack

### Frontend
- React (with Hooks and Context API)
- Redux Toolkit for state management
- Material-UI for responsive design
- Formik and Yup for form validation
- Recharts for data visualization

### Backend
- Node.js and Express for RESTful API
- MongoDB with Mongoose for data persistence
- JWT for authentication and authorization
- Integration with OpenAI API for content generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- OpenAI API Key (for AI features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/dxaginfo/ai-content-idea-platform.git
   cd ai-content-idea-platform
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the development servers

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

6. Open your browser and go to `http://localhost:3000`

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express app
│   ├── .env.example      # Example environment variables
│   └── package.json
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── features/     # Redux slices
    │   ├── pages/        # Page components
    │   ├── utils/        # Helper functions
    │   ├── App.js        # Main app component
    │   ├── index.js      # Entry point
    │   └── theme.js      # Material-UI theme
    └── package.json
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/password` - Update password
- `PUT /api/auth/preferences` - Update user preferences

### Content Ideas
- `GET /api/ideas` - Get all ideas (with filters)
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

### AI Generation
- `POST /api/ai/generate-ideas` - Generate content ideas
- `POST /api/ai/generate-calendar` - Generate content calendar
- `POST /api/ai/analyze-trends` - Analyze content trends

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Content performance analytics
- Integration with social media platforms
- Collaborative team features
- AI-powered content optimization suggestions
- Content repurposing recommendations
