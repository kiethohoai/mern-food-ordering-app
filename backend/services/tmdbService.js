import axios from 'axios';
import { ENV_VARS } from '../config/envVars.js';

export const fetchFromTMDB = async (url) => {
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ENV_VARS.TMDB_API_KEY}`,
    },
  };

  const respone = await axios.get(url, options);

  if (respone.status !== 200) {
    throw new Error(`Fail to fet data from TMDB + ${respone.statusText}`);
  }

  return respone.data;
};
