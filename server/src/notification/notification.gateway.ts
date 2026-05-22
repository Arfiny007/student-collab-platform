import {
  WebSocketGateway,
  WebSocketServer,
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
export class NotificationGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

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

      // NEVER change room naming
      client.join(
        `user-${userId}`,
      );

      console.log(
        "notification connected:",
        userId,
      );
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(
    client: Socket,
  ) {
    console.log(
      "notification disconnected:",
      client.data
        ?.userId,
    );
  }

  sendNotification(
    userId: number,
    message: string,
  ) {
    this.server
      .to(
        `user-${userId}`,
      )
      .emit(
        "notification",
        message,
      );
  }
}