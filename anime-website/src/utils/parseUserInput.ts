import { genreViToEn } from "./genreMap";
import studiosList from "@/data/studioList.json";

export type ApiType =
  | "recommend"
  | "unrecommend"
  | "season_recommend"
  | "season_unrecommend"
  | "by_genre"
  | "by_studio"
  | "by_studio_unrecommend"
  | "by_year"
  | "by_year_unrecommend"
  | "not_yet_aired"
  | "top_airing"
  | "untop_airing"
  | "top_upcoming"
  | "most_popular"
  | "recommend_movie"
  | "unrecommend_movie"
  | "recommend_tv"
  | "by_genre_unrecommend"
  | "random";

export interface RequestParams {
  apiType: ApiType;
  year?: number;
  season?: string;
  genre?: string;
  studio?: string;
  top_n: number;
}

export function parseUserInput(input: string): RequestParams | null {
  const lowerInput = input.toLowerCase();
  let apiType: ApiType | null = null;

  let genre: string | undefined;
  let studio: string | undefined;
  let season: string | undefined;

  const isUnrecommend = lowerInput.includes("tệ") || lowerInput.includes("dở");

  // Genre
  for (const gVi of Object.keys(genreViToEn)) {
    if (lowerInput.includes(gVi)) {
      genre = genreViToEn[gVi];
      break;
    }
  }

  // Studio
  for (const studioName of studiosList) {
    if (lowerInput.includes(studioName.toLowerCase())) {
      studio = studioName;
      break;
    }
  }

  // Season
  const isSeasonal =
    lowerInput.includes("xuân") ||
    lowerInput.includes("hè") ||
    lowerInput.includes("hạ") ||
    lowerInput.includes("thu") ||
    lowerInput.includes("đông");

  if (isSeasonal) {
    if (lowerInput.includes("xuân")) season = "Spring";
    else if (lowerInput.includes("hè") || lowerInput.includes("hạ"))
      season = "Summer";
    else if (lowerInput.includes("thu")) season = "Fall";
    else if (lowerInput.includes("đông")) season = "Winter";
  }

  // Year
  let year: number | undefined;
  const yearMatch = input.match(/19[6-9]\d|20\d{2}/);

  if (yearMatch) {
    year = parseInt(yearMatch[0]);
  } else if (isSeasonal) {
    year = new Date().getFullYear(); // Mặc định là năm hiện tại nếu có mùa
  }

  // Ưu tiên các từ khóa cụ thể
  if (lowerInput.includes("ngẫu nhiên") || lowerInput.includes("random")) {
    apiType = "random";
  } else if (
    lowerInput.includes("chưa chiếu") ||
    lowerInput.includes("chưa phát sóng") ||
    lowerInput.includes("not yet aired")
  ) {
    apiType = "not_yet_aired";
  } else if (lowerInput.includes("phim") || lowerInput.includes("movie")) {
    apiType = isUnrecommend ? "unrecommend_movie" : "recommend_movie";
  } else if (
    lowerInput.includes("hot") ||
    lowerInput.includes("nổi bật") ||
    lowerInput.includes("phổ biến") ||
    lowerInput.includes("nhiều người xem")
  ) {
    apiType = "most_popular";
  } else if (
    lowerInput.includes("đang chiếu") ||
    lowerInput.includes("airing") ||
    lowerInput.includes("đang phát sóng")
  ) {
    apiType = isUnrecommend ? "untop_airing" : "top_airing";
  } else if (genre) {
    apiType = isUnrecommend ? "by_genre_unrecommend" : "by_genre";
  } else if (studio) {
    apiType = isUnrecommend ? "by_studio_unrecommend" : "by_studio";
  } else if (isSeasonal && year) {
    apiType = isUnrecommend ? "season_unrecommend" : "season_recommend";
  } else if (year) {
    apiType = isUnrecommend ? "by_year_unrecommend" : "by_year";
  } else if (lowerInput.includes("hay")) {
    apiType = isUnrecommend ? "unrecommend" : "recommend";
  }

  // Validate
  if (
    (apiType === "season_recommend" || apiType === "season_unrecommend") &&
    (!season || !year)
  ) {
    console.log("Thiếu thông tin mùa hoặc năm.");
    return null;
  }

  if (apiType === "by_genre" && !genre) {
    console.log("Thiếu thông tin thể loại.");
    return null;
  }

  if (apiType === "by_studio" && !studio) {
    console.log("Thiếu thông tin studio.");
    return null;
  }

  if (apiType === "by_year" && !year) {
    console.log("Thiếu thông tin năm.");
    return null;
  }

  if (!apiType) {
    console.log("Không xác định được kiểu API.");
    return null;
  }

  return {
    apiType,
    year,
    season,
    genre,
    studio,
    top_n: 5,
  };
}
