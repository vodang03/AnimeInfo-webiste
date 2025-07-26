import {
  fetchRecommend,
  fetchUnrecommend,
  fetchSeasonRecommend,
  fetchSeasonUnrecommend,
  fetchByGenre,
  fetchByStudio,
  fetchByYear,
  fetchTopAiring,
  fetchMostPopular,
  fetchMovieRecommend,
  fetchRandom,
  fetchByGenreUnrecommend,
  fetchByGenreSeasonAndYear,
  fetchByGenreAndYear,
  fetchByGenreSeasonAndYearUnrecommend,
  fetchByGenreAndYearUnrecommend,
  fetchByYearUnrecommend,
  fetchByStudioUnrecommend,
  fetchByStudioSeasonAndYear,
  fetchByStudioAndYear,
  fetchByStudioSeasonAndYearUnrecommend,
  fetchByStudioAndYearUnrecommend,
  fetchUntopAiring,
  fetchMovieUnrecommend,
  fetchNotYetAired,
} from "@/api/recommend";

import { RequestParams } from "./parseUserInput";

export async function callApiByType(params: RequestParams) {
  const { apiType, year, season, top_n, genre, studio } = params;

  switch (apiType) {
    case "recommend":
      return fetchRecommend(top_n);

    case "unrecommend":
      return fetchUnrecommend(top_n);

    case "season_recommend":
      if (year !== undefined && season !== undefined) {
        return fetchSeasonRecommend(year, season, top_n);
      }
      break;

    case "season_unrecommend":
      if (year !== undefined && season !== undefined) {
        return fetchSeasonUnrecommend(year, season, top_n);
      }
      break;

    // ✅ Kịch bản mở rộng
    case "by_genre":
      if (genre && year === undefined && season === undefined) {
        return fetchByGenre(genre, top_n);
      } else if (genre && year !== undefined && season !== undefined) {
        return fetchByGenreSeasonAndYear(genre, season, year, top_n);
      } else if (genre && year !== undefined && season === undefined) {
        return fetchByGenreAndYear(genre, year, top_n);
      }
      break;

    case "by_genre_unrecommend":
      if (genre && year === undefined && season === undefined) {
        return fetchByGenreUnrecommend(genre, top_n);
      } else if (genre && year !== undefined && season !== undefined) {
        return fetchByGenreSeasonAndYearUnrecommend(genre, season, year, top_n);
      } else if (genre && year !== undefined && season === undefined) {
        return fetchByGenreAndYearUnrecommend(genre, year, top_n);
      }
      break;

    case "by_studio":
      if (studio && year === undefined && season === undefined) {
        return fetchByStudio(studio, top_n);
      } else if (studio && year !== undefined && season !== undefined) {
        return fetchByStudioSeasonAndYear(studio, season, year, top_n);
      } else if (studio && year !== undefined && season === undefined) {
        return fetchByStudioAndYear(studio, year, top_n);
      }
      break;

    case "by_studio_unrecommend":
      if (studio && year === undefined && season === undefined) {
        return fetchByStudioUnrecommend(studio, top_n);
      } else if (studio && year !== undefined && season !== undefined) {
        return fetchByStudioSeasonAndYearUnrecommend(
          studio,
          season,
          year,
          top_n
        );
      } else if (studio && year !== undefined && season === undefined) {
        return fetchByStudioAndYearUnrecommend(studio, year, top_n);
      }
      break;

    case "by_year":
      if (year !== undefined) return fetchByYear(year, top_n);
      break;

    case "by_year_unrecommend":
      if (year !== undefined) return fetchByYearUnrecommend(year, top_n);
      break;

    case "top_airing":
      return fetchTopAiring(top_n);

    case "untop_airing":
      return fetchUntopAiring(top_n);

    case "most_popular":
      return fetchMostPopular(top_n, year!);

    case "recommend_movie":
      return fetchMovieRecommend(top_n, year!);

    case "unrecommend_movie":
      return fetchMovieUnrecommend(top_n, year!);

    case "not_yet_aired":
      return fetchNotYetAired(top_n);

    case "random":
      return fetchRandom(top_n); // 1 hoặc nhiều anime ngẫu nhiên
  }

  throw new Error("Thông tin request không hợp lệ.");
}
