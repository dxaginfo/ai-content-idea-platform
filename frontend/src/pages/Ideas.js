import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SortIcon from '@mui/icons-material/Sort';

import { getIdeas, updateIdea, deleteIdea } from '../features/ideas/ideasSlice';

const IdeaCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const Ideas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { ideas, pagination, loading } = useSelector((state) => state.ideas);

  // State for search and filters
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    contentType: '',
    platform: '',
  });
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  // Menu states
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Parse query parameters on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';
    const typeFilter = searchParams.get('contentType') || '';
    const platformFilter = searchParams.get('platform') || '';
    const sortByParam = searchParams.get('sortBy') || 'createdAt';
    const sortOrderParam = searchParams.get('sortOrder') || 'desc';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    setSearchValue(searchQuery);
    setFilters({
      status: statusFilter,
      contentType: typeFilter,
      platform: platformFilter,
    });
    setSort({
      sortBy: sortByParam,
      sortOrder: sortOrderParam,
    });
    setPage(pageParam);

    // Initial fetch
    fetchIdeas({
      search: searchQuery,
      status: statusFilter,
      contentType: typeFilter,
      platform: platformFilter,
      sortBy: sortByParam,
      sortOrder: sortOrderParam,
      page: pageParam,
    });
  }, [location.search]);

  const fetchIdeas = (queryParams) => {
    dispatch(getIdeas(queryParams));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const handleSearchButtonClick = () => {
    applyFilters();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setSort({ sortBy, sortOrder });
    setSortMenuAnchor(null);
    applyFilters({ sortBy, sortOrder });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    applyFilters({ page: value });
  };

  const applyFilters = (additionalParams = {}) => {
    const params = {
      search: searchValue,
      ...filters,
      ...sort,
      page,
      ...additionalParams,
    };

    // Update URL with query parameters
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });

    navigate({
      pathname: '/ideas',
      search: searchParams.toString(),
    });

    // Fetch ideas with filters
    fetchIdeas(params);
  };

  const resetFilters = () => {
    setSearchValue('');
    setFilters({
      status: '',
      contentType: '',
      platform: '',
    });
    setSort({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(1);
    setFilterMenuAnchor(null);

    navigate('/ideas');
    fetchIdeas({
      page: 1,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleToggleFavorite = (idea) => {
    dispatch(
      updateIdea({
        id: idea._id,
        ideaData: { isFavorite: !idea.isFavorite },
      })
    );
  };

  const handleActionMenuOpen = (event, idea) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedIdea(idea);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedIdea(null);
  };

  const handleViewIdea = () => {
    handleActionMenuClose();
    navigate(`/ideas/${selectedIdea._id}`);
  };

  const handleEditIdea = () => {
    handleActionMenuClose();
    navigate(`/ideas/${selectedIdea._id}/edit`);
  };

  const handleDeleteIdea = () => {
    handleActionMenuClose();
    if (selectedIdea) {
      dispatch(deleteIdea(selectedIdea._id));
    }
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Content Ideas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/generate')}
        >
          Generate Ideas
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search ideas"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchButtonClick}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              >
                Filter
              </Button>

              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={(e) => setSortMenuAnchor(e.currentTarget)}
              >
                Sort
              </Button>
            </Box>
          </Grid>

          {/* Active filters display */}
          {(filters.status || filters.contentType || filters.platform) && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Active Filters:
                </Typography>
                {filters.status && (
                  <Chip
                    label={`Status: ${filters.status}`}
                    size="small"
                    onDelete={() => {
                      setFilters({ ...filters, status: '' });
                      applyFilters({ status: '' });
                    }}
                  />
                )}
                {filters.contentType && (
                  <Chip
                    label={`Type: ${filters.contentType}`}
                    size="small"
                    onDelete={() => {
                      setFilters({ ...filters, contentType: '' });
                      applyFilters({ contentType: '' });
                    }}
                  />
                )}
                {filters.platform && (
                  <Chip
                    label={`Platform: ${filters.platform}`}
                    size="small"
                    onDelete={() => {
                      setFilters({ ...filters, platform: '' });
                      applyFilters({ platform: '' });
                    }}
                  />
                )}
                {(filters.status || filters.contentType || filters.platform) && (
                  <Button size="small" onClick={resetFilters}>
                    Clear All
                  </Button>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Ideas Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : ideas.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {ideas.map((idea) => (
              <Grid item xs={12} sm={6} md={4} key={idea._id}>
                <IdeaCard className="idea-card-hover">
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Chip
                          label={idea.contentType}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1, mr: 1 }}
                        />
                        <Chip
                          label={idea.status}
                          size="small"
                          color={getStatusChipColor(idea.status)}
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Box>
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleActionMenuOpen(e, idea)}
                          size="small"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {idea.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '3em',
                      }}
                    >
                      {idea.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {idea.keywords?.slice(0, 3).map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" variant="outlined" />
                      ))}
                      {idea.keywords?.length > 3 && (
                        <Chip
                          label={`+${idea.keywords.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ backgroundColor: 'grey.200' }}
                        />
                      )}
                    </Box>

                    <Divider sx={{ mt: 1, mb: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {idea.platform || 'All platforms'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/ideas/${idea._id}`)}
                    >
                      View Details
                    </Button>
                    <Tooltip title={idea.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton
                        onClick={() => handleToggleFavorite(idea)}
                        color={idea.isFavorite ? 'primary' : 'default'}
                        size="small"
                        aria-label="favorite"
                      >
                        {idea.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </IdeaCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No ideas found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {searchValue || filters.status || filters.contentType || filters.platform
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Get started by generating some content ideas.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/generate')}
            sx={{ mt: 2 }}
          >
            Generate Ideas
          </Button>
        </Paper>
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          sx: { width: 250, maxWidth: '100%', p: 1 },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Filter Ideas
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Box sx={{ p: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              name="status"
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={filters.contentType}
              name="contentType"
              label="Content Type"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="blog">Blog</MenuItem>
              <MenuItem value="social">Social Media</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="podcast">Podcast</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="infographic">Infographic</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={filters.platform}
              name="platform"
              label="Platform"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="all">Multiple Platforms</MenuItem>
              <MenuItem value="website">Website</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="youtube">YouTube</MenuItem>
              <MenuItem value="tiktok">TikTok</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button size="small" onClick={resetFilters}>
              Reset
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                applyFilters();
                setFilterMenuAnchor(null);
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
      >
        <MenuItem onClick={() => handleSortChange('createdAt', 'desc')}>
          <Typography
            variant="body2"
            fontWeight={sort.sortBy === 'createdAt' && sort.sortOrder === 'desc' ? 'bold' : 'regular'}
          >
            Newest First
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('createdAt', 'asc')}>
          <Typography
            variant="body2"
            fontWeight={sort.sortBy === 'createdAt' && sort.sortOrder === 'asc' ? 'bold' : 'regular'}
          >
            Oldest First
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('title', 'asc')}>
          <Typography
            variant="body2"
            fontWeight={sort.sortBy === 'title' && sort.sortOrder === 'asc' ? 'bold' : 'regular'}
          >
            Title (A-Z)
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('title', 'desc')}>
          <Typography
            variant="body2"
            fontWeight={sort.sortBy === 'title' && sort.sortOrder === 'desc' ? 'bold' : 'regular'}
          >
            Title (Z-A)
          </Typography>
        </MenuItem>
      </Menu>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleViewIdea}>View Details</MenuItem>
        <MenuItem onClick={handleEditIdea}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteIdea} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Ideas;