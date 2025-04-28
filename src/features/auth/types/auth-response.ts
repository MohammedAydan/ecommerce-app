import UserType from "@/types/user-type";

export default interface AuthResponse {
    code: number;
    message: string;
    errors: string[] | null;
    accessToken: string;
    refreshToken: string;
    user: UserType;
}