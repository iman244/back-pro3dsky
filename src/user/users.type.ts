import { Exclude } from 'class-transformer';

interface DocumentResult<T> extends Document {
  _doc: T;
}

export interface hasToken extends Object {
  token: string;
}

export interface credentials {
  username: string;
  password: string;
}

export interface User extends DocumentResult<Object> {
  _id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  token: string;
}
