import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  try {
    if (!res.socket?.server?.io) {
      console.log('New Socket.io server...');
      // Initialize the Socket.io server

      //fixme: allowUpgrades causes an error for some reason ..
      const io = new ServerIO(
        res.socket.server,
        {
          path: "/api/socket/io",
          addTrailingSlash: false,
          cors: { origin: "*" },
          allowUpgrades: false
        }
      );

      // const io = new ServerIO(res.socket.server, {
      //   path: '/api/socket/io',
      //   addTrailingSlash: false,
      // });

      // Attach the Socket.io server to the Next.js HTTP server
      res.socket.server.io = io;

      io.on('connection', (socket) => {
        console.log('A client connected');
        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
      });
    } else {
      console.log('Socket.io server already running...');
    }
  } catch (error){
    console.log('Something went wrong...');
    console.log(error);
  }

  res.end();
};

export default ioHandler;