import { Mongo } from "meteor/mongo";

export interface AuthenticatedToken {
  _id?: string;
  phoneNumber: string;
  code: string;
  isApproved: boolean;
}

export const AuthenticatedTokens = new Mongo.Collection<AuthenticatedToken>(
  "tokens"
);
