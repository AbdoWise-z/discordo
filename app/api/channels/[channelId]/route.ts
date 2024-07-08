import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {MemberRole} from "@prisma/client";


export async function DELETE(
  req: Request,
  {params}: {params: {channelId: string}}
){
  try {
    const profile = await currentUserProfile(false);
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!params.channelId){
      return new NextResponse("Channel ID messing", {status: 400});
    }

    if (!serverId){
      return new NextResponse("Server ID messing", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODIRATOR],
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            }
          }
        }
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("DELETE [api/channels/[channelId]]" , error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}


export async function PATCH(
  req: Request,
  {params}: {params: {channelId: string}}
){
  try {
    const {name , type} = await req.json();
    const profile = await currentUserProfile(false);
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const channelId = params.channelId;

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!name || !type || !serverId || !channelId || name == 'general'){
      return new NextResponse("invalid params", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODIRATOR],
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              }
            },
            data: {
              name,
              type,
            }
          }
        }
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("PATCH [api/channels/[channelId]]" , error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}