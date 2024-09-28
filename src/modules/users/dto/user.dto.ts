import { Request } from 'express';

export type CreateUserDTO = {
  username: string;
  password: string;
  email: string;
  name: string;
};

export type UserCreatedDTO = {
  id: string;
  createdAt: Date;
} & CreateUserDTO;

export type UsernameAndEmail = {
  username: string;
  email: string;
};

export type UserProfile = {
  user: {
    sub: string;
    username: string;
  };
};

export type RequestWithUser = Request & UserProfile;

export type FileDTO = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type AvatarDTO = {
  idUser: string;
  file: FileDTO;
};
