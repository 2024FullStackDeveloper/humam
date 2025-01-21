import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import ApiAction from "./lib/server/action";
import { APILoginResponseType } from "./lib/types/api/api-type";
import { z } from "zod";
import { LoginSchema } from "./lib/schemas/authorization-schema";

const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                emailOrPhoneNumber: {},
                password: {}
            },
            async authorize(credentials, req) {
                try {
                    const { emailOrPhoneNumber, password } = credentials as z.infer<typeof LoginSchema>;
                    const response = await ApiAction<APILoginResponseType>({
                        controller: "user",
                        url: "login",
                        method: "POST",
                        body: { emailOrPhoneNumber, password },
                    });


                    if (!response?.isServerOn || response.result?.code != 0) {
                        throw new Error(JSON.stringify(response));
                    }

                    if (response?.result?.code == 0) {
                        if (!response?.result?.data?.token) {
                            const profileResult = await ApiAction<APILoginResponseType>({
                                controller: "user",
                                url: "login",
                                method: "POST",
                                body: { ...{ emailOrPhoneNumber, password }, profileId: response?.result?.data?.profiles?.find(e => e.role == "admin")?.profileId },
                            });
                            return { ...profileResult?.result!.data as any, token: profileResult?.result?.data?.token, id: profileResult?.result?.data?.userDetails?.id };
                        } else {
                            return { ...response?.result?.data as any, token: response?.result?.data?.token, id: response?.result?.data?.userDetails?.id };
                        }
                    }
                } catch (e) {
                    if (e instanceof Error) {
                        throw e;
                    }
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/",
        error: "/"
    },
    secret: process.env.NEXTAUTH_SECREAT!,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        session: ({ session, token }) => {
            if(token){
                return {...session,user:{...token}};
            }
            return session;
        },

        jwt:  ({ token, user}) => {
            if (user) {
                token.userDetails = {
                    ...user.userDetails,
                    id :user.userDetails!.id,
                    fullName:user.userDetails!.fullName,
                    isSuperUser:user.userDetails!.isSuperUser,
                    phoneNumber:user.userDetails!.phoneNumber,
                    profileId:user.userDetails!.profileId,
                    role:user.userDetails!.role,
                };
                token.token = user.token;
                token.email = user.userDetails?.email;
                token.picture = user.userDetails?.personImg;
                token.name = user.userDetails?.fullName;
                token.profiles = user.profiles;
                token.userDetails = user.userDetails;
            }
            return token;
        },

    }
};

export default authOptions;