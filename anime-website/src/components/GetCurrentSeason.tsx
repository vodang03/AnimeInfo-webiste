export default function getCurrentSeasonAndYear() {
  const now = new Date();

  // ✅ Trừ đi 10 ngày
  const adjusted = new Date(now);
  adjusted.setDate(now.getDate() - 10);

  const year = adjusted.getFullYear();
  const month = adjusted.getMonth() + 1; // JS month từ 0–11

  let season = "";

  if (month >= 4 && month <= 6) {
    season = "spring";
  } else if (month >= 7 && month <= 9) {
    season = "summer";
  } else if (month >= 10 && month <= 12) {
    season = "fall";
  } else {
    season = "winter";
  }

  return { season, year };
}
