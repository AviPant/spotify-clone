import { AxiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useState, type ReactNode, useEffect } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete AxiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  // Setup token & admin check
  useEffect(() => {
    const setup = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        if (token) {
          await checkAdminStatus();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.error("Error in AuthProvider:", error);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, [getToken, checkAdminStatus]);

  // Setup socket once userId is available
  useEffect(() => {
    if (userId) {
      initSocket(userId);
      return () => {
        disconnectSocket();
      };
    }
  }, [userId, initSocket, disconnectSocket]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <div>{children}</div>;
};

export default AuthProvider;
