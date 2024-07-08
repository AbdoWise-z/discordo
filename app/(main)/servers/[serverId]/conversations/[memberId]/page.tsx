import React from 'react';

const MemberChatPage = (
  {
    params
  } : {
    params: {
      memberId: string;
      serverId: string;
    },
  }
) => {
  return (
    <div>
      Member Conversation at : ${params.serverId} / ${params.memberId}
    </div>
  );
};

export default MemberChatPage;