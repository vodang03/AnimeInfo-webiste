// /app/api/anime/recommend.ts hoặc /utils/api.ts nếu muốn gom chung

import axios from "axios";

export const fetchRecommend = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/recommend", { top_n })
    .then((res) => res.data);
};

export const fetchUnrecommend = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/unrecommend", { top_n })
    .then((res) => res.data);
};

export const fetchSeasonRecommend = async (
  year: number,
  season: string,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/season/recommend", { year, season, top_n })
    .then((res) => res.data);
};

export const fetchSeasonUnrecommend = async (
  year: number,
  season: string,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/season/unrecommend", { year, season, top_n })
    .then((res) => res.data);
};

export const fetchByGenre = async (genre: string, top_n: number) => {
  return axios
    .post("http://localhost:8000/genre", { genre, top_n })
    .then((res) => res.data);
};

export const fetchByGenreUnrecommend = async (genre: string, top_n: number) => {
  return axios
    .post("http://localhost:8000/genre/unrecommend", { genre, top_n })
    .then((res) => res.data);
};

export const fetchByGenreSeasonAndYear = async (
  genre: string,
  season: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/genre/season/year", {
      genre,
      season,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByGenreSeasonAndYearUnrecommend = async (
  genre: string,
  season: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/unrecommend/genre/season/year", {
      genre,
      season,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByGenreAndYear = async (
  genre: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/genre/year", {
      genre,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByGenreAndYearUnrecommend = async (
  genre: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/unrecommend/genre/year", {
      genre,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByStudio = async (studio: string, top_n: number) => {
  return axios
    .post("http://localhost:8000/studio", { studio, top_n })
    .then((res) => res.data);
};

export const fetchByStudioSeasonAndYear = async (
  studio: string,
  season: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/studio/season/year", {
      studio,
      season,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByStudioAndYear = async (
  studio: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/studio/year", {
      studio,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByStudioUnrecommend = async (
  studio: string,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/unrecommend/studio", { studio, top_n })
    .then((res) => res.data);
};

export const fetchByStudioSeasonAndYearUnrecommend = async (
  studio: string,
  season: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/unrecommend/studio/season/year", {
      studio,
      season,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByStudioAndYearUnrecommend = async (
  studio: string,
  year: number,
  top_n: number
) => {
  return axios
    .post("http://localhost:8000/unrecommend/studio/year", {
      studio,
      year,
      top_n,
    })
    .then((res) => res.data);
};

export const fetchByYear = async (year: number, top_n: number) => {
  return axios
    .post("http://localhost:8000/year", { year, top_n })
    .then((res) => res.data);
};

export const fetchByYearUnrecommend = async (year: number, top_n: number) => {
  return axios
    .post("http://localhost:8000/unrecommend/year", { year, top_n })
    .then((res) => res.data);
};

export const fetchTopAiring = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/top/airing", { top_n })
    .then((res) => res.data);
};

export const fetchUntopAiring = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/untop/airing", { top_n })
    .then((res) => res.data);
};

export const fetchNotYetAired = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/notaired", { top_n })
    .then((res) => res.data);
};

export const fetchMostPopular = async (top_n: number, year: number) => {
  return axios
    .post("http://localhost:8000/top/popular", { top_n, year })
    .then((res) => res.data);
};

export const fetchMovieRecommend = async (top_n: number, year: number) => {
  return axios
    .post("http://localhost:8000/recommend/movie", { top_n, year })
    .then((res) => res.data);
};

export const fetchMovieUnrecommend = async (top_n: number, year: number) => {
  return axios
    .post("http://localhost:8000/unrecommend/movie", { top_n, year })
    .then((res) => res.data);
};

export const fetchRandom = async (top_n: number) => {
  return axios
    .post("http://localhost:8000/random", { top_n })
    .then((res) => res.data);
};
