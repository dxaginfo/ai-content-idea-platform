import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { getIdeaById, updateIdea, deleteIdea } from '../features/ideas/ideasSlice';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[1],
}));

const IdeaDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idea, loading } = useSelector((state) => state.ideas);

  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    contentType: '',
    platform: '',
    status: '',
    targetAudience: [],
    keyPoints: [],
    keywords: [],
    notes: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getIdeaById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (idea) {
      setEditFormData({
        title: idea.title || '',
        description: idea.description || '',
        contentType: idea.contentType || '',
        platform: idea.platform || '',
        status: idea.status || '',
        targetAudience: idea.targetAudience || [],
        keyPoints: idea.keyPoints || [],
        keywords: idea.keywords || [],
        notes: idea.notes || '',
      });
    }
  }, [idea]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    let newArray = [];

    if (typeof value === 'string') {
      newArray = value.split(',').map((item) => item.trim());
    } else if (Array.isArray(value)) {
      newArray = value;
    }

    setEditFormData({
      ...editFormData,
      [fieldName]: newArray,
    });
  };

  const handleSubmitEdit = () => {
    dispatch(updateIdea({ id, ideaData: editFormData }));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditFormData({
      title: idea.title || '',
      description: idea.description || '',
      contentType: idea.contentType || '',
      platform: idea.platform || '',
      status: idea.status || '',
      targetAudience: idea.targetAudience || [],
      keyPoints: idea.keyPoints || [],
      keywords: idea.keywords || [],
      notes: idea.notes || '',
    });
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteIdea(id));
    setDeleteDialogOpen(false);
    navigate('/ideas');
  };

  const handleToggleFavorite = () => {
    dispatch(updateIdea({ id, ideaData: { isFavorite: !idea.isFavorite } }));
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'inProgress':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading || !idea) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/ideas')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Idea Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleToggleFavorite}
            color={idea.isFavorite ? 'primary' : 'default'}
            aria-label="favorite"
          >
            {idea.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          {!editMode && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      {editMode ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Edit Content Idea
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="contentType"
                  value={editFormData.contentType}
                  onChange={handleEditChange}
                  label="Content Type"
                >
                  <MenuItem value="blog">Blog</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="podcast">Podcast</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="infographic">Infographic</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Platform</InputLabel>
                <Select
                  name="platform"
                  value={editFormData.platform}
                  onChange={handleEditChange}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="tiktok">TikTok</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Audience"
                name="targetAudience"
                value={editFormData.targetAudience.join(', ')}
                onChange={(e) => handleArrayChange(e, 'targetAudience')}
                margin="normal"
                helperText="Separate multiple audiences with commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key Points"
                name="keyPoints"
                value={editFormData.keyPoints.join(', ')}
                onChange={(e) => handleArrayChange(e, 'keyPoints')}
                margin="normal"
                multiline
                rows={3}
                helperText="Separate multiple points with commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keywords"
                name="keywords"
                value={editFormData.keywords.join(', ')}
                onChange={(e) => handleArrayChange(e, 'keywords')}
                margin="normal"
                helperText="Separate multiple keywords with commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleEditChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label={idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  color={getStatusChipColor(idea.status)}
                />
                <Chip
                  label={
                    idea.platform === 'all'
                      ? 'All Platforms'
                      : idea.platform.charAt(0).toUpperCase() + idea.platform.slice(1)
                  }
                  variant="outlined"
                />
                {idea.isAIGenerated && <Chip label="AI Generated" color="secondary" variant="outlined" />}
              </Box>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {idea.title}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {idea.description}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Key Points
                </Typography>
                {idea.keyPoints && idea.keyPoints.length > 0 ? (
                  <List>
                    {idea.keyPoints.map((point, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={`• ${point}`} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No key points added yet.
                  </Typography>
                )}
              </Box>

              {idea.keywords && idea.keywords.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {idea.keywords.map((keyword, index) => (
                      <Chip key={index} label={keyword} />
                    ))}
                  </Box>
                </Box>
              )}

              {idea.notes && (
                <Box sx={{ mt: 4 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" fontWeight="bold">
                        Notes
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1">{idea.notes}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Audience
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {idea.targetAudience && idea.targetAudience.length > 0 ? (
                      <List dense>
                        {idea.targetAudience.map((audience, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText primary={`• ${audience}`} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No target audience specified.
                      </Typography>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Metadata
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List dense>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Created"
                          secondary={
                            idea.createdAt && new Date(idea.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          }
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Last Updated"
                          secondary={
                            idea.updatedAt && new Date(idea.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          }
                        />
                      </ListItem>
                      {idea.completionDate && (
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText
                            primary="Completion Date"
                            secondary={
                              new Date(idea.completionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Actions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setEditMode(true)}
                        startIcon={<EditIcon />}
                      >
                        Edit Idea
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => setDeleteDialogOpen(true)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete Idea
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Idea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this idea? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdeaDetail;