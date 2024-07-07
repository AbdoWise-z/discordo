import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";


export async function DELETE(
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

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        ownerId: profile.id,
      },
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("DELETE [api/servers/[serverId]]" , error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}

export async function PATCH(req: Request, {params}: {
  params: {
    serverId: string;
  }
}) {
  try {
    const profile = await currentUserProfile(false);
    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!params.serverId){
      return new NextResponse("server id missing", {status: 400});
    }

    const {name , imageUrl} = await req.json();

    if (!name || !imageUrl){
      return new NextResponse("invalid params", {status: 400});
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        ownerId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      }
    });

    return NextResponse.json(server , {
      status: server ? 200 : 404,
    });

  } catch (error){
    console.log("PATCH [api/servers/[serverid]]]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}