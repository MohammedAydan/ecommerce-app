import UserType from "@/types/user-type";
import SignInType from "./types/sign-in-type";
import SignUpType from "./types/sign-up-type";
import { createContext, useEffect, useState } from "react";
import { signInAction } from "./actions/sign-in-action";
import { signUpAction } from "./actions/sign-up-action";
import { signOutAction } from "./actions/sign-out-action";
import { checkIsAuthAction } from "./actions/check-is-auth-action";
import { updateUserAction } from "./actions/update-user-action";
import UpdateUserType from "./types/update-user-type";

export interface AuthContextProps {
    user: UserType | null;
    isLoading: boolean;
    error: string | null;
    signIn: (signIn: SignInType) => Promise<void>;
    signUp: (signUp: SignUpType) => Promise<void>;
    checkIsAuth: () => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (userData: UpdateUserType) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            checkIsAuth();
        }
    }, [user]);

    const signIn = async (signIn: SignInType) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await signInAction(signIn);
            if (response.code !== 200) {
                setError(`${response.message}${response.errors?.length ? `: ${response.errors.join(', ')}` : ''}`);
                return;
            }

            setUser({
                ...response.user,
                imageUrl: response.user.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.user.imageUrl}` : "",
            });
        } catch (error) {
            setError(`${error ?? "Sign In Error"}`);
        } finally {
            setIsLoading(false);
        }
    }

    const signUp = async (signUp: SignUpType) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await signUpAction(signUp);
            if (response.code !== 200) {
                setError(`${response.message}${response.errors?.length ? `: ${response.errors.join(', ')}` : ''}`);
                return;
            }

            setUser({
                ...response.user,
                imageUrl: response.user.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.user.imageUrl}` : "",
            });
        } catch (error) {
            setError(`${error ?? "Sign Up Error"}`);
        } finally {
            setIsLoading(false);
        }
    }

    const checkIsAuth = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await checkIsAuthAction();
            setUser({
                ...response,
                imageUrl: response.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.imageUrl}` : "",
            });
        } catch (error) {
            // setError(`${error ?? "Check is Auth Error"}`);
            console.log(error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    const signOut = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await signOutAction();
            setUser(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Sign Out Error");
        } finally {
            setIsLoading(false);
        }
    }

    const updateUser = async (userData: UpdateUserType) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await updateUserAction(userData);
            setUser({
                ...response,
                imageUrl: response.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.imageUrl}` : "",
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Sign Out Error");
        } finally {
            setIsLoading(false);
        }
    }

    const values = {
        user,
        isLoading,
        error,
        signIn,
        signUp,
        checkIsAuth,
        signOut,
        updateUser,
    };

    return (<AuthContext.Provider value={values}>{children}</AuthContext.Provider>)
}