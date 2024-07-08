import { currentUserProfile } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export const POST = async (req: Request) => {
  try {
    const {name , type} = await req.json();
    const profile = await currentUserProfile(false);
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!name || !type || !serverId || name == 'general'){
      return new NextResponse("invalid params", {status: 400});
    }

    const server = await db.server.update({
     where: {
       id: serverId,
       members: {
         some: {
           profileId: profile.id,
           role: {
             in: [
               MemberRole.ADMIN,
               MemberRole.MODIRATOR
             ]
           },
         }
       }
     },
      data: {
       channels: {
         create: [
           {
             name: name,
             type: type,
             profileId: profile.id,
           }
         ]
       }
      }
    });

    return new NextResponse("Successfully created", {status: 200});
  } catch (error){
    console.log("[api/servers/post]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}