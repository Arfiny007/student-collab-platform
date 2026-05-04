import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  InjectRepository,
} from "@nestjs/typeorm";

import {
  Repository,
} from "typeorm";

import { Message } from "./message.entity";

import { User } from "../modules/user/user.entity";

import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(
      Message,
    )
    private messageRepo: Repository<Message>,

    @InjectRepository(
      User,
    )
    private userRepo: Repository<User>,

    private gateway: ChatGateway,
  ) {}

  async send(
    senderId: number,
    receiverId: number,
    text: string,
  ) {
    const sender =
      await this.userRepo.findOne({
        where: {
          id: senderId,
        },
      });

    const receiver =
      await this.userRepo.findOne({
        where: {
          id: receiverId,
        },
      });

    if (
      !sender ||
      !receiver
    ) {
      throw new NotFoundException();
    }

    const message =
      new Message();

    message.text =
      text;

    message.sender =
      sender;

    message.receiver =
      receiver;

    const saved =
      await this.messageRepo.save(
        message,
      );

    this.gateway.sendMessage(
      receiverId,
      saved,
    );

    return saved;
  }

  async getConversation(
    userId: number,
    otherId: number,
  ) {
    const messages =
      await this.messageRepo
        .createQueryBuilder(
          "message",
        )
        .leftJoinAndSelect(
          "message.sender",
          "sender",
        )
        .leftJoinAndSelect(
          "message.receiver",
          "receiver",
        )
        .where(
          `
(sender.id = :userId AND receiver.id = :otherId)
OR
(sender.id = :otherId AND receiver.id = :userId)
`,
          {
            userId,
            otherId,
          },
        )
        .orderBy(
          "message.id",
          "ASC",
        )
        .getMany();

    for (
      const m of messages
    ) {
      if (
        m.receiver.id ===
        userId
      ) {
        m.seen =
          true;

        await this.messageRepo.save(
          m,
        );
      }
    }

    return messages;
  }
}