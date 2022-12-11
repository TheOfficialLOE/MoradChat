import { Repository } from "@api/core/base-classes/Repository";
import { ConversationSchema } from "@api/modules/conversations/database/ConversationSchema";
import { ConversationEntity } from "@api/modules/conversations/domain/ConversationEntity";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Query, Types } from "mongoose";
import { ConversationMapper } from "@api/modules/conversations/database/ConversationMapper";
import {
  ConversationsRepositoryPort,
} from "@api/modules/conversations/database/ConversationsRepositoryPort";

export class ConversationsRepository
  extends Repository<ConversationSchema, ConversationEntity>
  implements ConversationsRepositoryPort {
  constructor(
    @InjectModel(ConversationSchema.name)
    model: Model<ConversationSchema>,
    mapper: ConversationMapper
  ) {
    super(model, mapper);
  }


  async getList(
    userId: string,
  ): Promise<ConversationEntity[]> {
    // const conversations = await this.model.find(entityFilterQuery, { messages: 0 })
    /// todo: conversations can't be null
    // return conversations.map(conversation => this.mapper.toDomain(conversation));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const conversations = await this.model.aggregate([{
      $match: {
        $or: [
          {
            userA: new Types.ObjectId(userId)
          },
          {
            userB: new Types.ObjectId(userId)
          }
        ]
      }
    },
      {
        $lookup: {
          from: "users",
          localField: "userA",
          foreignField: "_id",
          as: "userA"
        }
      },
      {
        $unwind: "$userA"
      },
      {
        $lookup: {
          from: "users",
          localField: "userB",
          foreignField: "_id",
          as: "userB"
        }
      },
      {
        $unwind: "$userB"
      },
      // todo: -------------------------
      // {
      //   $project: {
      //     creator: 1,
      //     recipient: 1,
      //     lastMessage: {
      //       $last: "$messages"
      //     },
      //     unread: {
      //       $size: {
      //         $filter: {
      //           input: "$messages",
      //           as: "message",
      //           cond: {
      //             $and: [
      //               { $eq: ["$$message.isSeen", false] },
      //               { $ne: ["$$message.author", new Types.ObjectId(userId)] },
      //             ]
      //           }
      //         }
      //       },
      //     },
      //   },
      // },
    ]);
    return conversations;
  }
}
