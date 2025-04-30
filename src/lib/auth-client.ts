import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  endpoints: {
    signIn: {
      social: "/api/auth/sign-in/social"
    }
  }
});

declare module "better-auth/react" {
  interface AuthClient {
    useSession(): {
      data: {
        user: {
          id: string;
          name: string;
          email: string;
          image?: string;
        };
        accessToken?: string;
      };
      isLoading: boolean;
    };
    signIn: {
      social(params: { provider: string }): Promise<any>;
    };
    signOut(): Promise<void>;
  }
}