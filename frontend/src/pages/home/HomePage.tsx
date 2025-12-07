import FeaturedSection from "@/components/FeaturedSection";
import SectionGrid from "@/components/SectionGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import Topbar from "@/components/ui/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
  } = useMusicStore();

  const { initializePlayer } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchTrendingSongs();
    fetchMadeForYouSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [
        ...featuredSongs,
        ...madeForYouSongs,
        ...trendingSongs,
      ];
      initializePlayer(allSongs);
    }
  }, [initializePlayer, madeForYouSongs, trendingSongs, featuredSongs]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <p className="text-lg animate-pulse">Loading your music...</p>
      </main>
    );
  }

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Evening</h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid title="Made for You" songs={madeForYouSongs} />
            <SectionGrid title="Trending" songs={trendingSongs} />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
