import {NextApiRequest} from "next";
import {NextApiResponseServerIO} from "@/types";
import {currentUserProfilePages} from "@/lib/user-profile-pages";
import {db} from "@/lib/db";
import {Member, MemberRole} from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
){

  if (req.method !== 'PATCH' && req.method !== 'DELETE'){
    return res.status(404).json({
      error: "Method Not Allowed",
    })
  }


  try {
    const profile = await currentUserProfilePages(req);
    const {content , fileUrl} = req.body
    const { messageId , serverId , channelId} = req.query;

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

    if (!messageId){
      return res.status(400).json({
        error: "Message ID is missing",
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

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      }
    })

    if (!message || message.deleted){
      return res.status(404).json({
        error: "Message not found",
      })
    }

    const isOwner = message.senderId == member.id as string;
    const isAdmin = member.role == MemberRole.ADMIN;
    const isModerator = member.role == MemberRole.MODIRATOR;
    const canEdit = isOwner || isAdmin || isModerator;

    if (!canEdit){
      return res.status(401).json({
        error: "UnAuthorized",
      })
    }

    if (req.method === 'DELETE'){
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: "This message has been deleted",
          deleted: true,
          Attachment: null,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        }
      })
    } else {
      if (!isOwner){
        return res.status(401).json({
          error: "UnAuthorized",
        })
      }

      if (!content){
        return res.status(400).json({
          error: "Content is missing",
        })
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        }
      })
    }

    const channelKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error){
    console.log("POST [api/socket/messages]",error);
    return res.status(500).json({
      error: "Internal error",
    })
  }


}