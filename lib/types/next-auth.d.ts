//import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";

import {APILoginResponseType} from "./api/api-type";

declare module "next-auth" {
    interface User extends APILoginResponseType  {
        id:String
    }
    
    interface Session  {
        user: APILoginResponseType
    }
}


declare module "next-auth/jwt" {
    interface JWT extends APILoginResponseType {

  }
}