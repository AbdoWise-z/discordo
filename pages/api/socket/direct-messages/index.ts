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
      const {serverId , conversationId} = req.query;

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
      if (!conversationId){
        return res.status(400).json({
          error: "Conversation ID is missing",
        })
      }

      if (!content){
        return res.status(400).json({
          error: "Content is missing",
        })
      }

      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId as string,
          members: {
            some: {
              profileId: profile.id,
            }
          },
        },
        include: {
          members: {
            include: {
              profile: true,
            }
          }
        }
      })

      if (!conversation){
        return res.status(404).json({
          error: "Conversation not found.",
        })
      }

      const member = conversation.members.find((m: Member) => m.profileId === profile.id)
      if (!member){
        return res.status(404).json({
          error: "Member not found",
        })
      }

      const message = await db.directMessage.create({
        data: {
          content: content,
          Attachment: fileUrl,
          conversationId: conversationId as string,
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

      const channelKey = `chat:${conversationId}:messages`;

      res?.socket?.server?.io?.emit(channelKey, message);

      return res.status(200).json(message);
    } catch (error){
      console.log("POST [api/socket/direct-messages]",error);
      return res.status(500).json({
        error: "Internal error",
      })
    }
  }

  return res.status(404).json({
    error: "Method Not Allowed",
  })
}