import {db} from "@/lib/db";

export const getOrCreateConversation = async (member1: string, member2: string) => {
  const exist = await findConversationsWith(member1, member2);
  if (exist) {
    return exist;
  }
  return await createNewConversation(member1, member2);
}

const findConversationsWith = async (member1: string, member2: string) => {
  try {
    const conv = await db.conversation.findFirst({
      where: {
        membersIds: {
          hasEvery: [
            member1,
            member2
          ],
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          }
        }
      }
    });

    if (conv == null){
      console.log("No conversations found");
    }

    return conv;
  } catch (error){
    console.error("conversations.ts@findConversationsWith " , error);
    return null;
  }
}


const createNewConversation = async (member1: string, member2: string) => {
  try {
    const conv = await db.conversation.create({
      data: {
        membersIds: [
          member1,
          member2,
        ]
      },
    })

    if (conv){

      //Prisma doesn't auto update m-to-m relations
      const memberIds = [member1, member2];

      for (const memberId of memberIds) {
        await db.member.update({
          where: {id: memberId},
          data: {
            conversationsIds: {
              push: conv.id,
            },
          },
        });
      }

      // re-query to get the updated members
      return findConversationsWith(member1, member2);
    }

  } catch (error) {
    console.error("conversations.ts@createNewConversation " , error);
    return null;
  }
}