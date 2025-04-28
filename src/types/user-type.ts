export default interface UserType {
    id: string;
    userName: string;
    email: string;
    imageUrl?: string;
    country: string;
    city: string;
    address: string;
    phoneNumber?: string;
    roles?: string[];
    lastSignIn?: string; 
    createdAt?: string; 
    updatedAt?: string; 
}