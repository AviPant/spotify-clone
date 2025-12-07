import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

import Header from "./components/Header";
import DashBoardStats from "./components/DashBoardStats";
import SongsTabContent from "./components/SongsTabContent";
import AlbumTabContent from "./components/AlbumTabContent";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, Album } from "lucide-react";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />
      <DashBoardStats />

      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>

          <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>

        <TabsContent value="albums"> {/* ✅ fixed from "Albums" to "albums" */}
          <AlbumTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
