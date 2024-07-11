import {Server, Member, Profile, Message} from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {profile: Profile})[],
}

import { Server as HttpServer } from 'http';
import { Socket } from 'net';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io?: ServerIO;
    };
  };
};

export type MessageWithMembersWithProfiles = Message & {
  sender: Member & {profile: Profile};
}
