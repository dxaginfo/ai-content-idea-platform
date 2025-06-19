import axios from 'axios';

/**
 * Sets or removes the authentication token from axios headers
 * @param {string|null} token - JWT token or null to remove
 */
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;