import { fetchAnimeById, fetchTrailerByAnimeId } from "@/api/anime";
import AnimeDetailClient from "@/components/AnimeDetailClient";

interface AnimeDetailPageProps {
  params: { id: string };
}

export default async function AnimeDetailPage({
  params,
}: AnimeDetailPageProps) {
  const anime = await fetchAnimeById(Number(params.id));
  const trailers = await fetchTrailerByAnimeId(Number(params.id));

  return <AnimeDetailClient anime={anime} trailer={trailers} />;
}
