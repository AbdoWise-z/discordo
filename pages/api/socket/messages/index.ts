import {NextRequest} from "next/server";
import {NextApiResponseServerIO} from "@/types";
import {currentUserProfilePages} from "@/lib/user-profile-pages";
import {NextApiRequest} from "next";
import {db} from "@/lib/db";
import {Member} from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
){
  if (req.method === 'POST'){
    try {
      const profile = await currentUserProfilePages(req);
      const {content , fileUrl} = req.body
      const {serverId , channelId} = req.query;

      if (!profile){
        return res.status(401).json({
          error: "UnAuthorized",
        })
      }

      if (!serverId){
        return res.status(400).json({
          error: "Server ID is missing",
        })
      }
      if (!channelId){
        return res.status(400).json({
          error: "Channel ID is missing",
        })
      }

      if (!content){
        return res.status(400).json({
          error: "Content is missing",
        })
      }

      const server = await db.server.findFirst({
        where: {
          id: serverId as string,
          members: {
            some: {
              profileId: profile.id,
            }
          }
        },
        include: {
          members: true,
        }
      })

      if (!server){
        return res.status(404).json({
          error: "Server not found",
        })
      }

      const channel = await db.channel.findFirst({
        where:{
          id: channelId as string,
          serverId: serverId as string,
        }
      })

      if (!channel){
        return res.status(404).json({
          error: "Channel not found",
        })
      }

      const member = server.members.find((m: Member) => m.profileId == profile.id)
      if (!member){
        return res.status(404).json({
          error: "Member not found",
        })
      }

      const message = await db.message.create({
        data: {
          content: content,
          Attachment: fileUrl,
          channelId: channelId as string,
          senderId: member.id,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        }
      })

      const channelKey = `chat:${channelId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    } catch (error){
      console.log("POST [api/socket/messages]",error);
      return res.status(500).json({
        error: "Internal error",
      })
    }
  }

  return res.status(404).json({
    error: "Method Not Allowed",
  })
}