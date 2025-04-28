export default interface UpdateUserType {
    userName: string;
    email: string;
    image?: File | null;
    country: string;
    city: string;
    address: string;
    phoneNumber: string;
}

export interface UpdateUserPasswordType {
    password: string;
    confirmPassword: string;
}