from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Khi làm thật có thể đổi thành ['http://localhost:3000'] cho bảo mật
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load CSV và xử lý NaN
df = pd.read_csv('anime.csv').fillna('').reset_index(drop=True)
df['score'] = pd.to_numeric(df['score'], errors='coerce').fillna(0)

# Định nghĩa input model
class TopNRequest(BaseModel):
    year: int
    season: str  # Ví dụ: 'Winter', 'Spring', 'Summer', 'Fall'
    top_n: int = 5

# Định nghĩa input model
class SimpleTopNRequest(BaseModel):
    top_n: int = 5

# Định nghĩa input model cho genre
class GenreRequest(BaseModel):
    genre: str
    top_n: int = 5
    
class GenreSeasonYearRequest(BaseModel):
    genre: str
    season: str
    year: int
    top_n: int = 5    
    
class GenreYearRequest(BaseModel):
    genre: str
    year: int
    top_n: int = 5

    
# Định nghĩa input model cho studio
class StudioRequest(BaseModel):
    studio: str
    top_n: int = 5
    
class StudioSeasonYearRequest(BaseModel):
    studio: str
    season: str
    year: int
    top_n: int = 5
    
class StudioYearRequest(BaseModel):
    studio: str
    year: int
    top_n: int = 5

# Định nghĩa input model cho random
class RandomRequest(BaseModel):
    top_n: int = 5  # Số anime ngẫu nhiên muốn lấy
    
class MovieRequest(BaseModel):
    year: Optional[int] = None
    top_n: int = 5

class PopularRequest(BaseModel):
    year: Optional[int] = None
    top_n: int = 5

# Định nghĩa input model anime theo năm
class AnimeYearRequest(BaseModel):
    year:int
    top_n: int = 5
    
df['popularity'] = pd.to_numeric(df['popularity'], errors='coerce')
df['favorites'] = pd.to_numeric(df['favorites'], errors='coerce')
df['scored_by'] = pd.to_numeric(df['scored_by'], errors='coerce')
df['score'] = pd.to_numeric(df['score'], errors='coerce')
df['year'] = pd.to_numeric(df['year'], errors='coerce')

    
# Những bộ anime top
@app.post("/recommend")
def recommend_top_anime(request: SimpleTopNRequest):
    df['final_score'] = (
        df['popularity'] * 0.3 +
        df['favorites'] * 0.2 +
        df['scored_by'] * 0.2 +
        df['score'] * 0.2 +
        df['year'] * 0.1
    )
    
    # Lấy top N anime có score cao nhất
    top_anime = df.sort_values(by='final_score', ascending=False).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = top_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "recommendations": recommendations
    }

@app.post("/unrecommend")
def unrecommend_anime(request: SimpleTopNRequest):
    # Loại các bộ anime 0 điểm
    filtered_df = df[df['score'] > 0]
    # Loại các bộ anime có điểm nhỏ hơn 6.5 điểm
    filtered_df = filtered_df[filtered_df['score'] < 6]
    
    filtered_df['final_score'] = (
        filtered_df['popularity'] * 0.3 +
        filtered_df['favorites'] * 0.2 +
        filtered_df['scored_by'] * 0.2 +
        filtered_df['score'] * 0.2 +
        filtered_df['year'] * 0.1
    )
    
    # Lấy top N anime có score cao nhất
    lowest_anime = filtered_df.sort_values(by='final_score', ascending=True).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = lowest_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "recommendations": recommendations
    }

# Những bộ anime top theo mùa
@app.post("/season/recommend")
def recommend_top_seasonanime(request: TopNRequest):
    # Bước 1: Lọc theo năm và mùa
    filtered_df = df[
        (df['year'] == request.year) &
        (df['season'].str.lower() == request.season.lower())
    ]
    
    # Bước 2: Kiểm tra nếu không có anime nào trong mùa đó
    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No anime found for the specified year and season")
    
    # Lấy top N anime có score cao nhất
    top_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = top_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "year": request.year,
        "season": request.season,
        "recommendations": recommendations
    }
    
# Những bộ anime top theo mùa
@app.post("/season/unrecommend")
def unrecommend_seasonanime(request: TopNRequest):
    # Bước 1: Lọc theo năm và mùa
    filtered_df = df[
        (df['year'] == request.year) &
        (df['season'].str.lower() == request.season.lower())
    ]
    
    # Bước 2: Kiểm tra nếu không có anime nào trong mùa đó
    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No anime found for the specified year and season")
    
    # Loại các bộ 0 điểm
    lowest_df = filtered_df[filtered_df['score'] > 0]
    
    # Lấy top N anime có score cao nhất
    lowest_seasonanime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = lowest_seasonanime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "year": request.year,
        "season": request.season,
        "recommendations": recommendations
    }
    
@app.post("/genre")
def recommend_by_genre(request: GenreRequest):
    genre_lower = request.genre.lower()

    # Lọc những anime có trường genres chứa genre nhập vào (case-insensitive)
    filtered_df = df[df['genres'].str.lower().str.contains(genre_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for genre '{request.genre}'")

    # Lấy top N anime có điểm score cao nhất
    top_genre_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_genre_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "genre": request.genre,
        "recommendations": recommendations
    }
    
@app.post("/genre/season/year")
def recommend_by_genre_season_year(request: GenreSeasonYearRequest):
    genre_lower = request.genre.lower()
    season_lower = request.season.lower()
    year = request.year

    # Lọc theo năm
    filtered_df = df[df['year'] == year]

    # Lọc theo mùa (season) nếu cột season tồn tại
    if 'season' in df.columns:
        filtered_df = filtered_df[filtered_df['season'].str.lower() == season_lower]
    
    # Lọc theo thể loại (genre)
    filtered_df = filtered_df[filtered_df['genres'].str.lower().str.contains(genre_lower)]

    if filtered_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No anime found for genre '{request.genre}' in {request.season} {request.year}"
        )

    # Lấy top N anime theo score giảm dần
    top_genre_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_genre_anime[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "genre": request.genre,
        "season": request.season,
        "year": request.year,
        "recommendations": recommendations
    }   
    
@app.post("/genre/year")
def recommend_by_genre_year(request: GenreYearRequest):
    genre_lower = request.genre.lower()
    year = request.year

    # Lọc theo năm
    filtered_df = df[df['year'] == year]
    
    # Lọc theo thể loại (genre)
    filtered_df = filtered_df[filtered_df['genres'].str.lower().str.contains(genre_lower)]

    if filtered_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No anime found for genre '{request.genre}' in {request.year}"
        )

    # Lấy top N anime theo score giảm dần
    top_genre_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_genre_anime[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "genre": request.genre,
        "year": request.year,
        "recommendations": recommendations
    }     
    
@app.post("/genre/unrecommend")
def unrecommend_by_genre(request: GenreRequest):
    genre_lower = request.genre.lower()

    # Lọc những anime có trường genres chứa genre nhập vào (case-insensitive)
    filtered_df = df[df['genres'].str.lower().str.contains(genre_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for genre '{request.genre}'")
    
    # Loại các bộ 0 điểm
    lowest_df = filtered_df[filtered_df['score'] > 0]

    top_genre_anime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = top_genre_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "genre": request.genre,
        "recommendations": recommendations
    } 

@app.post("/unrecommend/genre/season/year")
def unrecommend_by_genre_season_year(request: GenreSeasonYearRequest):
    genre_lower = request.genre.lower()
    season_lower = request.season.lower()
    year = request.year

    filtered_df = df[df['year'] == year]

    if 'season' in df.columns:
        filtered_df = filtered_df[filtered_df['season'].str.lower() == season_lower]

    filtered_df = filtered_df[filtered_df['genres'].str.lower().str.contains(genre_lower)]


    if filtered_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No anime found for genre '{request.genre}' in {request.season} {request.year}"
        )

    # Loại các bộ 0 điểm
    lowest_df = filtered_df[filtered_df['score'] > 0]

    # ⚠️ Điểm khác biệt: sort ascending (tăng dần)
    bottom_genre_anime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = bottom_genre_anime[[  
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "genre": request.genre,
        "season": request.season,
        "year": request.year,
        "recommendations": recommendations  # 👈 Đổi key này nếu muốn phân biệt rõ
    }
    
@app.post("/unrecommend/genre/year")
def unrecommend_by_genre_year(request: GenreYearRequest):
    genre_lower = request.genre.lower()
    year = request.year

    filtered_df = df[df['year'] == year]
    filtered_df = filtered_df[filtered_df['genres'].str.lower().str.contains(genre_lower)]

    if filtered_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No anime found for genre '{request.genre}' in {request.year}"
        )
        
    # Loại các bộ 0 điểm
    lowest_df = filtered_df[filtered_df['score'] > 0]

    bottom_genre_anime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = bottom_genre_anime[[  
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "genre": request.genre,
        "year": request.year,
        "recommendations": recommendations
    }
       
    
@app.post("/studio")
def recommend_by_studio(request: StudioRequest):
    studio_lower = request.studio.lower()

    # Lọc những anime có trường studios chứa studio nhập vào (không phân biệt chữ hoa thường)
    filtered_df = df[df['studios'].str.lower().str.contains(studio_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for studio '{request.studio}'")

    # Lấy top N anime có điểm số cao nhất
    top_studio_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }
    
@app.post("/studio/season/year")
def recommend_by_studio_season_year(request: StudioSeasonYearRequest):
    studio_lower = request.studio.lower()
    season_lower = request.season.lower()
    year = request.year

    filtered_df = df[df['year'] == year]

    if 'season' in df.columns:
        filtered_df = filtered_df[filtered_df['season'].str.lower() == season_lower]

    # Lọc những anime có trường studios chứa studio nhập vào (không phân biệt chữ hoa thường)
    filtered_df = filtered_df[filtered_df['studios'].str.lower().str.contains(studio_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for studio '{request.studio}'")

    # Lấy top N anime có điểm số cao nhất
    top_studio_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }
    
@app.post("/studio/year")
def recommend_by_studio_year(request: StudioYearRequest):
    studio_lower = request.studio.lower()
    year = request.year

    filtered_df = df[df['year'] == year]

    # Lọc những anime có trường studios chứa studio nhập vào (không phân biệt chữ hoa thường)
    filtered_df = filtered_df[filtered_df['studios'].str.lower().str.contains(studio_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for studio '{request.studio}'")

    # Lấy top N anime có điểm số cao nhất
    top_studio_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    recommendations = top_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }
    
@app.post("/unrecommend/studio")
def unrecommend_by_studio(request: StudioRequest):
    studio_lower = request.studio.lower()

    # Lọc những anime có trường studios chứa studio nhập vào (không phân biệt chữ hoa thường)
    filtered_df = df[df['studios'].str.lower().str.contains(studio_lower)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No anime found for studio '{request.studio}'")

    # Loại các bộ 0 điểm và có điểm lớn hơn 6
    lowest_df = filtered_df[(filtered_df['score'] > 0) & (filtered_df['score'] < 6)]

    # Lấy top N anime có điểm số cao nhất
    top_studio_anime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = top_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }

@app.post("/unrecommend/studio/season/year")
def unrecommend_by_studio_season_year(request: StudioSeasonYearRequest):
    studio_lower = request.studio.lower()
    season_lower = request.season.lower()
    year = request.year

    # Lọc theo năm
    filtered_df = df[df['year'] == year]

    # Lọc theo mùa (nếu có)
    if 'season' in df.columns:
        filtered_df = filtered_df[filtered_df['season'].str.lower() == season_lower]

    # Lọc theo studio
    filtered_df = filtered_df[filtered_df['studios'].str.lower().str.contains(studio_lower)]

    # Lọc điểm > 0 và < 6
    filtered_df = filtered_df[(filtered_df['score'] > 0) & (filtered_df['score'] < 6)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No low-score anime found for studio '{request.studio}'")

    # Sắp xếp tăng dần theo điểm
    bottom_studio_anime = filtered_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = bottom_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }

@app.post("/unrecommend/studio/year")
def unrecommend_by_studio_year(request: StudioYearRequest):
    studio_lower = request.studio.lower()
    year = request.year

    # Lọc theo năm
    filtered_df = df[df['year'] == year]

    # Lọc theo studio
    filtered_df = filtered_df[filtered_df['studios'].str.lower().str.contains(studio_lower)]

    # Lọc điểm > 0 và < 6
    filtered_df = filtered_df[(filtered_df['score'] > 0) & (filtered_df['score'] < 6)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No low-score anime found for studio '{request.studio}'")

    # Sắp xếp tăng dần theo điểm
    bottom_studio_anime = filtered_df.sort_values(by='score', ascending=True).head(request.top_n)

    recommendations = bottom_studio_anime[['mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "studio": request.studio,
        "recommendations": recommendations
    }


@app.post("/random")
def get_random_anime(request: RandomRequest):
    if df.empty:
        raise HTTPException(status_code=500, detail="Dataset is empty.")

    # Nếu top_n lớn hơn số lượng anime thì chỉ trả về số lượng hiện có
    top_n = min(request.top_n, len(df))

    # Lấy ngẫu nhiên top_n anime
    random_df = df.sample(n=top_n)

    # Chuẩn bị dữ liệu trả về
    results = random_df[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "total": top_n,
        "recommendations": results
    }

@app.post("/recommend/movie")
def recommend_movie(request: MovieRequest):
    df_cleaned = df.copy()
    
    df_cleaned["year"] = pd.to_numeric(df_cleaned["year"], errors="coerce")
    
    # Lọc type = "movie"
    movie_df = df_cleaned[df_cleaned["type"].str.lower() == "movie"]
    
    # Bỏ các dòng thiếu thông tin cần thiết
    movie_df = movie_df.dropna(subset=["year"])
    
    if request.year:
        movie_df = movie_df[movie_df["year"] >= request.year]

    if movie_df.empty:
        raise HTTPException(status_code=404, detail="No valid movie anime found.")

    # Lọc điểm > 6
    filtered_df = movie_df[(movie_df['score'] > 6)]

    # Lấy top N movie theo score cao nhất
    top_movies = filtered_df.sort_values(by="score", ascending=False).head(request.top_n)

    recommendations = top_movies[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "type": "Movie",
        "recommendations": recommendations
    }
    
@app.post("/unrecommend/movie")
def unrecommend_movie(request: MovieRequest):
    df_cleaned = df.copy()
    
    df_cleaned["year"] = pd.to_numeric(df_cleaned["year"], errors="coerce")
    
    # Lọc type = "movie"
    movie_df = df_cleaned[df_cleaned["type"].str.lower() == "movie"]
    
    # Bỏ các dòng thiếu thông tin cần thiết
    movie_df = movie_df.dropna(subset=["year"])
    
    if request.year:
        movie_df = movie_df[movie_df["year"] >= request.year]
    
    if movie_df.empty:
        raise HTTPException(status_code=404, detail="No valid movie anime found.")

    # Lọc điểm > 0 và < 6
    filtered_df = movie_df[(movie_df['score'] > 0) & (movie_df['score'] < 6)]

    # Lấy top N movie theo score cao nhất
    top_movies = filtered_df.sort_values(by="score", ascending=True).head(request.top_n)

    recommendations = top_movies[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "type": "Movie",
        "recommendations": recommendations
    }
    
@app.post("/notaired")
def not_aired(request: SimpleTopNRequest):
    not_aired_df = df[df["status"] == "Not yet aired"]
      
    if not_aired_df.empty:
        raise HTTPException(status_code=404, detail="No valid movie anime found.")

    # Lấy top N movie theo score cao nhất
    top_not_aired = not_aired_df.sort_values(by="favorites", ascending=False).head(request.top_n)

    recommendations = top_not_aired[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'image_url'
    ]].to_dict(orient='records')

    return {
        "type": "Movie",
        "recommendations": recommendations
    }

    
@app.post("/top/popular")
def popular_anime(request: PopularRequest):
    df_cleaned = df.copy()

    # Ép kiểu các cột cần thiết
    df_cleaned["scored_by"] = pd.to_numeric(df_cleaned["scored_by"], errors="coerce")
    df_cleaned["score"] = pd.to_numeric(df_cleaned["score"], errors="coerce")
    df_cleaned["year"] = pd.to_numeric(df_cleaned["year"], errors="coerce")

    # Bỏ các dòng thiếu thông tin cần thiết
    df_cleaned = df_cleaned.dropna(subset=["scored_by", "score", "year"])

    # Lọc điểm số > 7 và lọc theo năm nếu có
    df_filtered = df_cleaned[df_cleaned["score"] > 7]

    if request.year:
        df_filtered = df_filtered[df_filtered["year"] >= request.year]

    if df_filtered.empty:
        raise HTTPException(status_code=404, detail="No anime matched the popularity and score criteria.")

    # Sắp xếp theo scored_by giảm dần (phổ biến nhất)
    popular_anime = df_filtered.sort_values(by="scored_by", ascending=False).head(request.top_n)

    recommendations = popular_anime[[
        'mal_id', 'title', 'genres', 'studios', 'year', 'score', 'scored_by', 'image_url'
    ]].to_dict(orient='records')

    return {
        "type": f"Most Popular (by scored_by, score > 7{f', year >= {request.year}' if request.year else ''})",
        "recommendations": recommendations
    }

@app.post("/top/airing")
def top_airing_anime(request: SimpleTopNRequest):
    airing_df = df[df["airing"] == True]
    
    if airing_df.empty:
        raise HTTPException(status_code=404, detail="No airing anime found.")
    
    # Lấy top N anime có score cao nhất
    top_anime = airing_df.sort_values(by='score', ascending=False).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = top_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "recommendations": recommendations
    }
    
@app.post("/untop/airing")
def untop_airing_anime(request: SimpleTopNRequest):
    airing_df = df[df["airing"] == True]
    
    if airing_df.empty:
        raise HTTPException(status_code=404, detail="No airing anime found.")
    
    # Lọc điểm > 0 và < 6
    filtered_df = airing_df[(airing_df['score'] > 0) & (airing_df['score'] < 6)]
    
    # Danh sách thể loại nhạy cảm cần loại bỏ (chữ thường)
    sensitive_genres = {"hentai", "ecchi", "yaoi", "yuri", "smut", "erotica", "bdsm"}

    # Hàm kiểm tra genres an toàn
    def is_safe(genres_str):
        if not isinstance(genres_str, str):
            return True
        genres = [g.strip().lower() for g in genres_str.split(",")]
        return all(g not in sensitive_genres for g in genres)

    # Lọc bỏ các anime có genre nhạy cảm
    filtered_df = filtered_df[filtered_df['genres'].apply(is_safe)]
    
    # Lấy top N anime có score cao nhất
    untop_anime = filtered_df.sort_values(by='score', ascending=True).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = untop_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "recommendations": recommendations
    }
    
@app.post("/year")
def year_anime(request: AnimeYearRequest):
    filtered_df = df[(df['year'] == request.year)]
    
    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No airing anime found.")
    
    # Lấy top N anime có score cao nhất
    year_anime = filtered_df.sort_values(by='score', ascending=False).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = year_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "year": request.year,
        "recommendations": recommendations
    }
    
@app.post("/unrecommend/year")
def unrecommend_year_anime(request: AnimeYearRequest):
    filtered_df = df[(df['year'] == request.year)]
    
    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No airing anime found.")
    
    # Loại các bộ 0 điểm
    lowest_df = filtered_df[filtered_df['score'] > 0]
    
    year_anime = lowest_df.sort_values(by='score', ascending=True).head(request.top_n)

    # Chọn cột muốn trả về
    recommendations = year_anime[['mal_id','title', 'genres', 'studios', 'year', 'score', 'image_url']].to_dict(orient='records')

    return {
        "year": request.year,
        "recommendations": recommendations
    }