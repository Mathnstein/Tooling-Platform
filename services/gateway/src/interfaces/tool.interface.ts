import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Tool {
    @Field(() => ID, { description: "The unique identifier of the tool" })
    id: string;

    @Field(() => String, { description: "The name of the tool" })
    name: string;

    @Field(() => String, { description: "The slug of the tool" })
    slug: string;

    @Field(() => Boolean, { description: "Indicates whether the user has access to the tool" })
    hasAccess: boolean;
}