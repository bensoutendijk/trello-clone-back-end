import mongoose from 'mongoose';

export interface Board extends mongoose.Document {
  title: string;
  createdOn: Date;
  updatedOn: Date;
  members: { id: string; scopes: string[] }[];
  categories: string[];
  cards: string[];
  archived: boolean;
}

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdOn: { type: Date, required: true },
  updatedOn: { type: Date, required: true },
  members: { type: { id: String, scopes: [String] }, required: true },
  categories: { type: [String], required: true},
  cards: { type: [String], required: true },
  archived: { type: Boolean, required: true },
});

mongoose.model<Board>('Board', boardSchema);
export default Board;

export type BoardForm = Pick<Board, 'title' | 'updatedOn' | 'categories' >;