import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {v4 as uuidv4} from "uuid";


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
      return new NextResponse("Invalid server missing", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        ownerId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log(error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}