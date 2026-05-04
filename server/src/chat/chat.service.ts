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
    text?: string,
    file?: Express.Multer.File,
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

    message.file =
      file?.filename;

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

  async edit(
    id: number,
    text: string,
  ) {
    const msg =
      await this.messageRepo.findOne({
        where: {
          id,
        },
      });

    if (
      !msg
    )
      return;

    msg.text =
      text;

    msg.edited =
      true;

    return this.messageRepo.save(
      msg,
    );
  }

  async remove(
    id: number,
  ) {
    const msg =
      await this.messageRepo.findOne({
        where: {
          id,
        },
      });

    if (
      !msg
    )
      return;

    msg.deleted =
      true;

    msg.text =
      "Message deleted";

    return this.messageRepo.save(
      msg,
    );
  }

  async getConversation(
    userId: number,
    otherId: number,
  ) {
    return this.messageRepo
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
  }

  async getRecentChats(
    userId: number,
  ) {
    const messages =
      await this.messageRepo.find({
        relations: [
          "sender",
          "receiver",
        ],
        order: {
          id: "DESC",
        },
      });

    const unique =
      new Map();

    for (
      const m of messages
    ) {
      const other =
        m.sender.id ===
        userId
          ? m.receiver
          : m.sender;

      if (
        !unique.has(
          other.id,
        )
      ) {
        unique.set(
          other.id,
          {
            user:
              other,
            lastMessage:
              m.text ||
              "📎 file",
          },
        );
      }
    }

    return Array.from(
      unique.values(),
    );
  }
}