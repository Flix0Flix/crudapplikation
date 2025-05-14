import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
 
export const auth = betterAuth({
    database: new Database("./database.db"),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },    
    },
    emailAndPassword: {
        enabled: true
    }
    
})