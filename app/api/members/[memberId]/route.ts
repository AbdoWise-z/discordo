import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";


export async function DELETE(req: Request, {params}: {
  params: {
    memberId: string;
  }
}) {
  try {
    const profile = await currentUserProfile(false);
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const memberId = params.memberId;

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!serverId || !memberId){
      return new NextResponse("invalid params", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        ownerId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: memberId,
            profileId: {
              not: profile.id,
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("DELETE [api/members/[memberId]]]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}


export async function PATCH(req: Request, {params}: {
  params: {
    memberId: string;
  }
}) {
  try {
    const profile = await currentUserProfile(false);
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    const memberId = params.memberId;

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!role || !serverId || !memberId){
      return new NextResponse("invalid params", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        ownerId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              }
            },
            data: {
              role: role,
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("PATCH [api/members/[memberId]]]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}