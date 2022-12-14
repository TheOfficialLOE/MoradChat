import { IdentifiableSchema } from "@api/core/base-classes/IdentifiableSchema";
import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { UserSchema } from "@api/modules/auth/database/user/UserSchema";
import { MessagesSchema } from "@api/modules/conversations/database/MessageSchema";

@Schema({ collection: "conversations" })
export class ConversationSchema extends IdentifiableSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: UserSchema.name, autopopulate: true })
  userA: UserSchema;

  @Prop({ type: SchemaTypes.ObjectId, ref: UserSchema.name, autopopulate: true })
  userB: UserSchema;

  @Prop([MessagesSchema])
  messages: MessagesSchema[];

  @Prop({ type: MessagesSchema })
  lastMessage: MessagesSchema;

  @Prop()
  lastMessageSeenTimeStampUserA: number;

  @Prop()
  lastMessageSeenTimeStampUserB: number;
}
