import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import {NextApiRequest} from "next";

export const currentUserProfilePages = async (req: NextApiRequest) => {
  const user = getAuth(req);
  const userId = user.userId;

  if (!user || !user.userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.userId,
    }
  });

  if (profile) {
    return profile;
  }

  return null;
}