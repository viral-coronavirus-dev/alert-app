import { Mongo } from 'meteor/mongo'

export interface Request {
  _id?: string
  createdAt: Date
}

export const Requests = new Mongo.Collection<Request>('requests')
