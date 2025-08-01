import axios from "axios";

export const fetchAnimeSearch = async (query?: string) => {
  try {
    if (!query) return [];

    const params: { q?: string } = {};

    if (query) {
      params.q = query;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/search`,
      {
        params,
      }
    );

    return response.data; // hoặc response.data.data nếu backend trả về { data: [...] }
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const fetchGenreAnimeSearch = async (genre?: string) => {
  try {
    if (!genre) return [];

    const params: { genre?: string } = {};

    if (genre) {
      params.genre = genre;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/genresearch`,
      {
        params,
      }
    );

    return response.data; // hoặc response.data.data nếu backend trả về { data: [...] }
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const fetchThemeAnimeSearch = async (theme?: string) => {
  try {
    if (!theme) return [];

    const params: { theme?: string } = {};

    if (theme) {
      params.theme = theme;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/themesearch`,
      {
        params,
      }
    );

    return response.data; // hoặc response.data.data nếu backend trả về { data: [...] }
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const fetchSeasonalAnime = async (season: string, year: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/seasonal`,
      {
        params: { season, year },
        withCredentials: true,
        // headers: {
        //   "ngrok-skip-browser-warning": "69420",
        // },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
};

export const submitAnimeRating = async (
  user_id: number,
  animeId: number,
  score: number
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/ratings`,
      {
        user_id,
        animeId,
        score,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
};

export const fetchAnimeRating = async (user_id: number, animeId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/ratings`,
      {
        params: { user_id, animeId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching rating:", error);
    throw error;
  }
};

export const fetchAnime = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
};

// export const fetchBestAnime = async (page: number, limit: number) => {
//   try {
//     const response = await axios.get("http://localhost:5000/api/anime/best", {
//       params: { page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching anime:", error);
//     throw error;
//   }
// };

export const fetchhintAnime = async (searchTerm: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/hint`,
      {
        params: { q: searchTerm },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/genre`
    );
    return response.data; // [{ genre_id: 1, name: "Action" }, ...]
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const fetchAnimeByGenres = async (genreIds: number[]) => {
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/anime/by-genres?genres=${genreIds.join(",")}`
    );
    return response.data; // là mảng anime
  } catch (error) {
    console.error("Error fetching anime by genres:", error);
    throw error;
  }
};

export const importAnime = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/import-anime`
    );
    console.log("Dữ liệu backend:", res);
    return res.data;
  } catch (error) {
    console.error("Error import anime:", error);
    throw error;
  }
};

export const fetchAnimeById = async (id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching anime by id:", error);
    throw error;
  }
};

export const fetchTrailerByAnimeId = async (id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/${id}/trailer`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trailer by anime id:", error);
    throw error;
  }
};

interface UpdateAnimePayload {
  title_vietnamese?: string | null;
  synopsis_vn: string;
}

export const updateAnimeById = async (id: number, data: UpdateAnimePayload) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật anime:", error);
    throw error;
  }
};

export const fetchFavoAnime = async (user_id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/favoritelist/${user_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy anime:", error);
    throw error;
  }
};

export const fetchWatchStatusAnime = async (user_id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/planninglist/${user_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy anime planning:", error);
    throw error;
  }
};

export const updateWatchStatus = async (
  user_id: number,
  animeId: number,
  newstatus: number
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/watchstatus/`,
      {
        user_id,
        animeId,
        newstatus,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái xem:", error);
  }
};

export const fetchWatchStatusAPI = async (user_id: number, animeId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/watchstatus/`,
      {
        params: { user_id, animeId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái xem:", error);
  }
};
