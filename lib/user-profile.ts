import { db } from "@/lib/db";
import { currentUser, auth} from "@clerk/nextjs/server";

export const currentUserProfile = async (redirect?: boolean) => {
  const user = await currentUser();
  if (!user) {
    if (redirect) {
      return auth().redirectToSignIn();
    }
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    }
  });

  if (profile) {
    return profile;
  }

  try {
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      }
    })

    return newProfile;
  } catch (e) {
    return (await db.profile.findUnique({
      where: {
        userId: user.id,
      }
    }));
  }
}