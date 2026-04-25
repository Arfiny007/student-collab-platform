import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

 handleConnection(client: Socket) {
  const userId = client.handshake.query.userId;

  if (userId) {
    client.join(`user-${userId}`);
  }

  console.log('User connected:', client.id);
}

  sendNotification(userId: number, message: string) {
  this.server.to(`user-${userId}`).emit('notification', message);
}
}