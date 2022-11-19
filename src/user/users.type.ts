interface DocumentResult<T> extends Document {
  _doc: T;
}

export interface hasToken extends Object {
  token: string;
}

export enum Role {
  FREE = 100,
  PRO = 200,
  ADMIN = 300,
}

export interface credentials {
  username: string;
  password: string;
  role: Role;
}

export interface User extends DocumentResult<Object> {
  _id: string;
  username: string;
  password: string;
  role: Role;
  token: string;
}
