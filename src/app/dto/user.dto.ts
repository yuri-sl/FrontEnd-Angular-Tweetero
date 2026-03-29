export interface createUserRequest {
  username: string;
  avatar: string;
}

export interface createUserResponse {
  id: bigint;
  username: string;
  avatar: string;
}
