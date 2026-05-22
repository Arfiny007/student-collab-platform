import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import {
  Server,
  Socket,
} from "socket.io";

import * as jwt from "jsonwebtoken";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private onlineUsers =
    new Map<number, boolean>();

  handleConnection(
    client: Socket,
  ) {
    try {
      const token =
        client.handshake.auth
          ?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const decoded: any =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET ||
            "supersecret",
        );

      const userId =
        decoded.sub;

      client.data.userId =
        userId;

      client.join(
        `chat-${userId}`,
      );

      this.onlineUsers.set(
        userId,
        true,
      );

      this.broadcastUsers();
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(
    client: Socket,
  ) {
    const userId =
      client.data.userId;

    if (userId) {
      this.onlineUsers.delete(
        userId,
      );

      this.broadcastUsers();
    }
  }

  private broadcastUsers() {
    this.server.emit(
      "online-users",
      Array.from(
        this.onlineUsers.keys(),
      ),
    );
  }

  @SubscribeMessage(
    "typing",
  )
  typing(
    @MessageBody()
    data: any,
  ) {
    this.server
      .to(
        `chat-${data.receiverId}`,
      )
      .emit(
        "typing",
        data,
      );
  }

  sendMessage(
    receiverId: number,
    message: any,
  ) {
    this.server
      .to(
        `chat-${receiverId}`,
      )
      .emit(
        "message",
        message,
      );
  }
}