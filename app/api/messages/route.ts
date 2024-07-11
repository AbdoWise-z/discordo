import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {Message} from "@prisma/client";
import {db} from "@/lib/db";

const DefaultPatchSize = 20;
const MaxPatchSize = 40;

export async function GET(req: Request, {
}) {
  try {
    const { searchParams } = new URL(req.url);
    const profile = await currentUserProfile();
    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");
    const patch = parseInt(searchParams.get("patch") ?? `${DefaultPatchSize}`);
    const patchSize = patch < MaxPatchSize ? patch : MaxPatchSize;
    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if ( !channelId ){
      return new NextResponse("invalid params [channelId]", {status: 400});
    }

    let messages: Message[];

    //fixme: we don't validate that the user can read this channel

    if (cursor){
      messages = await db.message.findMany({
        take: patchSize,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId,
          //validate that the user has access to this channel
          // channel: {
          //   server: {
          //     members: {
          //       some: {
          //         profileId: profile.id,
          //       }
          //     }
          //   }
          // }
        },
        include: {
          sender: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.message.findMany({
        take: patchSize,
        where: {
          channelId: channelId,
        },
        include: {
          sender: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    }

    let nextCursor = null;
    if (messages.length === patchSize){
      nextCursor = messages[patchSize - 1].id;
    }

    return NextResponse.json(
      {
        items: messages,
        nextCursor: nextCursor,
      }
    );
  } catch (error){
    console.log("GET [api/messages]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}