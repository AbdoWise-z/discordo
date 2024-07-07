import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";

export async function PATCH(
  req: Request,
  {params}: {params: {serverId: string}}
){
  try {
    const profile = await currentUserProfile(false);
    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!params.serverId){
      return new NextResponse("Server ID messing", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        ownerId: {
          not: params.serverId,
        }
      },
      data: {
        members: {
          deleteMany: [
            {
              profileId: profile.id,
            }
          ]
        }
      }
    });
    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("PATCH [api/servers/[serverId]/leave]" , error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}