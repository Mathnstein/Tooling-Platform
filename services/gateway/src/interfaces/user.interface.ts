import { RoleType } from "#/generated/prisma/enums.js";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { Job } from "./job.interface.js";

registerEnumType(RoleType, {
    name: "RoleType",
    description: "The type of user you are",
});

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    name: string;

    @Field(() => RoleType)
    role: RoleType

    @Field(() => [Job], { nullable: "itemsAndList" })
    jobHistory?: Job[];
}