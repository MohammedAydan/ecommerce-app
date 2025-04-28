export default interface SignUpType {
    userName: string;
    email: string;
    image?: File | null;
    country: string;
    city: string;
    address: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}