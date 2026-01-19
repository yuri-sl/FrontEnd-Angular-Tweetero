export interface createUserRequest{
    username: String,
    avatar: String
}

export interface createUserResponse{
    id: bigint,
    username: String,
    avatar:String
}