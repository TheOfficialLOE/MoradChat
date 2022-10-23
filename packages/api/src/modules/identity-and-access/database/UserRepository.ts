import { Injectable } from "@nestjs/common";
import { Repository } from "../../../core/infrastructure/BaseRepository";
import { UserSchema } from "./UserSchema";
import { UserEntity } from "../domain/UserEntity";
import { UserMapper } from "./UserMapper";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserRepository extends Repository<UserSchema, UserEntity> {
  constructor(
    @InjectModel(UserSchema.name)
    readonly model: Model<UserSchema>,
    readonly mapper: UserMapper,
  ) {
    super(model, mapper);
  }
}
