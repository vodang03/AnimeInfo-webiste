import axios from "axios";

export const fetchAnimeSearch = async (query?: string) => {
  try {
    if (!query) return [];

    const params: { q?: string } = {};

    if (query) {
      params.q = query;
    }

    const response = await axios.get("http://localhost:5000/api/anime/search", {
      params,
    });

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
      "http://localhost:5000/api/anime/genresearch",
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
  // const url_backend = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/seasonal`,
      {
        params: { season, year },
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

export const fetchAnime = async (page: number, limit: number) => {
  try {
    const response = await axios.get("http://localhost:5000/api/anime/", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
};

export const fetchBestAnime = async (page: number, limit: number) => {
  try {
    const response = await axios.get("http://localhost:5000/api/anime/best", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
};

export const fetchhintAnime = async (searchTerm: string) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/anime/hint`, {
      params: { q: searchTerm },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/anime/genre");
    return response.data; // [{ genre_id: 1, name: "Action" }, ...]
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const fetchAnimeByGenres = async (genreIds: number[]) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/anime/by-genres?genres=${genreIds.join(",")}`
    );
    return response.data; // là mảng anime
  } catch (error) {
    console.error("Error fetching anime by genres:", error);
    throw error;
  }
};

export const importAnime = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/anime/import-anime");
    console.log("Dữ liệu backend:", res);
    return res.data;
  } catch (error) {
    console.error("Error import anime:", error);
    throw error;
  }
};

export const fetchAnimeById = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/anime/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime by id:", error);
    throw error;
  }
};

export const fetchTrailerByAnimeId = async (id: number) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/anime/${id}/trailer`
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
      `http://localhost:5000/api/anime/${id}`,
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
      `http://localhost:5000/api/anime/favoritelist/${user_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy anime:", error);
    throw error;
  }
};
