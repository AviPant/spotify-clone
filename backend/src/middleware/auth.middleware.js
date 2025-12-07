import { clerkClient, getAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // ✅ use getAuth, no await

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    // Optionally attach userId to req
    req.user = { userId };
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(500).json({ message: "Server error in auth check" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // ✅ use getAuth, no await

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    const currentUser = await clerkClient.users.getUser(userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser?.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - you must be admin" });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    res.status(500).json({ message: "Server error in admin check" });
  }
};
