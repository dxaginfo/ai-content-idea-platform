import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FeedIcon from '@mui/icons-material/Feed';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { getIdeas } from '../features/ideas/ideasSlice';

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { ideas, loading } = useSelector((state) => state.ideas);

  useEffect(() => {
    // Fetch recent ideas
    dispatch(getIdeas({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }));
  }, [dispatch]);

  // Stats data
  const stats = [
    {
      title: 'Total Ideas',
      value: '42',
      icon: <LightbulbIcon fontSize="large" color="primary" />,
      color: '#E3F2FD',
    },
    {
      title: 'In Progress',
      value: '12',
      icon: <FeedIcon fontSize="large" color="secondary" />,
      color: '#FFF3E0',
    },
    {
      title: 'Completed',
      value: '24',
      icon: <ThumbUpIcon fontSize="large" color="success" />,
      color: '#E8F5E9',
    },
    {
      title: 'Calendar Events',
      value: '18',
      icon: <CalendarMonthIcon fontSize="large" color="info" />,
      color: '#E1F5FE',
    },
  ];

  const handleGenerateIdeas = () => {
    navigate('/generate');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleGenerateIdeas}
        >
          Generate Ideas
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatsCard sx={{ bgcolor: stat.color }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="text.primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Box>{stat.icon}</Box>
              </Box>
            </StatsCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Ideas */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Ideas
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/ideas')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {ideas.length > 0 ? (
                  ideas.map((idea) => (
                    <ListItem
                      key={idea._id}
                      alignItems="flex-start"
                      button
                      onClick={() => navigate(`/ideas/${idea._id}`)}
                      divider
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.03)',
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {idea.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {idea.description}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={idea.contentType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={idea.status}
                              size="small"
                              color={
                                idea.status === 'completed'
                                  ? 'success'
                                  : idea.status === 'inProgress'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No ideas created yet. Start by generating some ideas!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleGenerateIdeas}
                      sx={{ mt: 2 }}
                    >
                      Generate Ideas
                    </Button>
                  </Box>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Trending Topics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Trending Topics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <List>
                {[
                  'AI in Healthcare',
                  'Sustainable Fashion',
                  'Remote Work Culture',
                  'Blockchain Applications',
                  'Mental Health Awareness',
                ].map((topic, index) => (
                  <ListItem key={index} divider={index < 4}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: '0.875rem',
                              bgcolor: 'primary.main',
                              mr: 1,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Typography variant="body1">{topic}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/trends')}
                  endIcon={<TrendingUpIcon />}
                >
                  View All Trends
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;