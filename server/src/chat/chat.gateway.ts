import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import {
  Server,
  Socket,
} from "socket.io";

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
    new Map();

  handleConnection(
    client: Socket,
  ) {
    const userId =
      Number(
        client.handshake
          .query.userId,
      );

    if (
      userId
    ) {
      client.join(
        `chat-${userId}`,
      );

      this.onlineUsers.set(
        userId,
        true,
      );

      this.server.emit(
        "online-users",
        Array.from(
          this.onlineUsers.keys(),
        ),
      );
    }
  }

  handleDisconnect(
    client: Socket,
  ) {
    const userId =
      Number(
        client.handshake
          .query.userId,
      );

    this.onlineUsers.delete(
      userId,
    );

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