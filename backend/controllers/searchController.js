import { User } from '../models/userModel.js';
import { fetchFromTMDB } from '../services/tmdbService.js';

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const respone = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`,
    );

    if (respone.results.length === 0) {
      res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: respone.results[0].id,
          image: respone.results[0].profile_path,
          title: respone.results[0].name,
          searchType: 'person',
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: respone.results,
    });
  } catch (error) {
    console.log('🚀Error on searchPerson Controller=', error.message);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error!',
    });
  }
};
export const searchMovie = async (req, res) => {};
export const searchTv = async (req, res) => {};
