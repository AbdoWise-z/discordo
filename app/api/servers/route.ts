import { currentUserProfile } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {$Enums, MemberRole} from "@prisma/client";
import ChannelType = $Enums.ChannelType;

export const POST = async (req: Request) => {
  try {
    const {name , imageUrl} = await req.json();
    const profile = await currentUserProfile(false);

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    const server = await db.server.create({
      data: {
        ownerId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              type: ChannelType.TEXT,
              profileId: profile.id,
            },
            {
              name: "voice",
              type: ChannelType.AUDIO,
              profileId: profile.id,
            }
          ]
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN ,
            }
          ]
        }
      }
    });

    return new NextResponse("Successfully created", {status: 200});
  } catch (error){
    console.log("POST [api/servers/post]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}