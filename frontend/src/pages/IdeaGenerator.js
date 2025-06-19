import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplayIcon from '@mui/icons-material/Replay';

import { generateIdeas } from '../features/ai/aiSlice';
import { createIdea } from '../features/ideas/ideasSlice';

const IdeaCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const contentTypes = [
  'blog',
  'social',
  'video',
  'podcast',
  'email',
  'infographic',
  'other',
];

const platforms = [
  'website',
  'linkedin',
  'instagram',
  'twitter',
  'facebook',
  'youtube',
  'tiktok',
  'all',
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'E-commerce',
  'Travel',
  'Food',
  'Fashion',
  'Entertainment',
  'Sports',
  'Real Estate',
  'Other',
];

const tones = [
  'Professional',
  'Casual',
  'Inspirational',
  'Educational',
  'Humorous',
  'Formal',
  'Conversational',
  'Persuasive',
];

const IdeaGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.ai);
  const { generatedIdeas } = useSelector((state) => state.ai);
  const { user } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('');
  const [platform, setPlatform] = useState('all');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [savedIdeas, setSavedIdeas] = useState({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 2) {
      // Generate ideas
      generateIdeasRequest();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTopic('');
    setContentType('');
    setPlatform('all');
    setIndustry('');
    setTone('Professional');
    setTargetAudience('');
    setKeywords([]);
    setKeywordInput('');
    setSavedIdeas({});
  };

  const generateIdeasRequest = () => {
    const params = {
      topic,
      contentType,
      platform,
      industry,
      tone,
      targetAudience,
      keywords,
    };

    dispatch(generateIdeas(params));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleKeywordInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const toggleSaveIdea = (ideaId) => {
    setSavedIdeas({
      ...savedIdeas,
      [ideaId]: !savedIdeas[ideaId],
    });
  };

  const saveIdeaToDatabase = (idea) => {
    const ideaData = {
      title: idea.title,
      description: idea.description,
      contentType,
      platform,
      status: 'draft',
      targetAudience: targetAudience.split(',').map((item) => item.trim()),
      keyPoints: idea.keyPoints,
      keywords: idea.keywords || keywords,
      notes: `Generated for ${topic}. Industry: ${industry}. Tone: ${tone}.`,
      isAIGenerated: true,
    };

    dispatch(createIdea(ideaData));
    toggleSaveIdea(idea.id);
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return topic.trim() !== '' && industry !== '';
      case 1:
        return contentType !== '' && platform !== '';
      case 2:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/ideas')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI Idea Generator
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Configure Your Generator
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Basic Information</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      label="Main Topic or Goal"
                      placeholder="e.g., Content Marketing Strategies"
                      variant="outlined"
                      fullWidth
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth required sx={{ mb: 2 }}>
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={industry}
                        label="Industry"
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        {industries.map((ind) => (
                          <MenuItem key={ind} value={ind}>
                            {ind}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ mb: 2, mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepComplete(0)}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>

              <Step>
                <StepLabel>Content Settings</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                      <InputLabel>Content Type</InputLabel>
                      <Select
                        value={contentType}
                        label="Content Type"
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        {contentTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 2 }}>
                      <InputLabel>Platform</InputLabel>
                      <Select
                        value={platform}
                        label="Platform"
                        onChange={(e) => setPlatform(e.target.value)}
                      >
                        {platforms.map((plat) => (
                          <MenuItem key={plat} value={plat}>
                            {plat === 'all'
                              ? 'All Platforms'
                              : plat.charAt(0).toUpperCase() + plat.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Tone</InputLabel>
                      <Select value={tone} label="Tone" onChange={(e) => setTone(e.target.value)}>
                        {tones.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ mb: 2, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button onClick={handleBack}>Back</Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepComplete(1)}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>

              <Step>
                <StepLabel>Additional Details (Optional)</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      label="Target Audience"
                      placeholder="e.g., Marketing professionals, Small business owners"
                      variant="outlined"
                      fullWidth
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label="Keywords"
                        placeholder="Add keywords and press Enter"
                        variant="outlined"
                        fullWidth
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleKeywordInputKeyDown}
                        InputProps={{
                          endAdornment: (
                            <Button
                              onClick={addKeyword}
                              disabled={!keywordInput.trim()}
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              Add
                            </Button>
                          ),
                        }}
                      />

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {keywords.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            onDelete={() => removeKeyword(keyword)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button onClick={handleBack}>Back</Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        startIcon={loading ? <CircularProgress size={20} /> : <LightbulbIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Generating...' : 'Generate Ideas'}
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>

            {activeStep === 3 && (
              <Box sx={{ pt: 2 }}>
                <Button startIcon={<ReplayIcon />} onClick={handleReset} fullWidth>
                  Generate More Ideas
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {generatedIdeas.length > 0 ? 'Generated Content Ideas' : 'Your Ideas Will Appear Here'}
              </Typography>
              {generatedIdeas.length > 0 && (
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={generateIdeasRequest}
                  disabled={loading}
                >
                  Regenerate
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : generatedIdeas.length > 0 ? (
              <Grid container spacing={3}>
                {generatedIdeas.map((idea) => (
                  <Grid item xs={12} key={idea.id}>
                    <IdeaCard className="fadeIn">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {idea.title}
                          </Typography>
                          <Tooltip
                            title={savedIdeas[idea.id] ? 'Saved to your ideas' : 'Save this idea'}
                          >
                            <IconButton
                              onClick={() =>
                                savedIdeas[idea.id]
                                  ? toggleSaveIdea(idea.id)
                                  : saveIdeaToDatabase(idea)
                              }
                              color={savedIdeas[idea.id] ? 'primary' : 'default'}
                            >
                              {savedIdeas[idea.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Typography variant="body1" paragraph>
                          {idea.description}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                          Key Points:
                        </Typography>
                        <ul>
                          {idea.keyPoints.map((point, index) => (
                            <li key={index}>
                              <Typography variant="body2">{point}</Typography>
                            </li>
                          ))}
                        </ul>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                          {idea.keywords?.map((keyword, index) => (
                            <Chip key={index} label={keyword} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="This idea was helpful">
                            <IconButton color="success">
                              <ThumbUpIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="This idea needs improvement">
                            <IconButton color="error">
                              <ThumbDownIcon />
                            </IconButton>
                          </Tooltip>
                          <Button
                            variant="contained"
                            onClick={() =>
                              savedIdeas[idea.id]
                                ? toggleSaveIdea(idea.id)
                                : saveIdeaToDatabase(idea)
                            }
                            color={savedIdeas[idea.id] ? 'secondary' : 'primary'}
                          >
                            {savedIdeas[idea.id] ? 'Saved' : 'Save Idea'}
                          </Button>
                        </Box>
                      </CardActions>
                    </IdeaCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <LightbulbIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No ideas generated yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Fill in the form on the left and click "Generate Ideas" to get content suggestions
                  tailored to your needs.
                </Typography>
                {activeStep === 3 && (
                  <Button
                    variant="contained"
                    onClick={generateIdeasRequest}
                    startIcon={<LightbulbIcon />}
                  >
                    Generate Now
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IdeaGenerator;