import { AccountStatusType } from "./status-type";
import { RoleType } from "./role-type";
import { DropdownType } from "../common-type";

interface APIResponseType<T>{
 httpStatusCode:number,
 timeStamp:bigint,
 code:number,
 message?:string | null,
 fields?:Array<APIErrorFieldType> | null,
 data?:T | null
};


interface APIErrorFieldType{
    propertyName:string,
    errorMessage:string,
    attemptedValue?:any,
    formattedMessagePlaceholderValues?:{
        PropertyName?:string,
        PropertyValue?:string
    }
};

interface APILoginResponseType{
token?:string | null,
userDetails?:APILoginUserDetailsResponseType | null,
profiles:Array<APILoginProfileResponseType>
};


interface APIVerifyUserResponseType{
phoneNumber:string,
sentOtp:boolean
};



interface APILoginProfileResponseType{
    profileId:number,
    role:RoleType,
    arDesc:string,
    enDesc:string,
    profileStatusCode:number,
    profileStatus:AccountStatusType,
    crtdAt:string,
    lastUpdateAt?:string | null
};


interface APILoginOrganizationDetailsResponseType{
id:number,
companyName:string,
responsibleName:string,
cRNumber:string,
cRNumberImg:string
};

interface APICollectionResponseType<T>{
    count:number,
    numberOfPages:number,
    resultSet:Array<T> | null
};

interface APILoginUserDetailsResponseType{
    id:String,
    profileId:number,
    role:RoleType,
    isSuperUser:boolean,
    fullName:string,
    email?:string | null,
    phoneNumber:string,
    personImg?:string  | null,
    organizationDetails?:APILoginOrganizationDetailsResponseType | null,
    crtdAt?:string | null,
    lastLogin?:string | null,
    lastLogOut?:string | null
   };


interface APIUserProfileType{
    profileId:number,
    fullName:string,
    role:RoleType,
    identity?:DropdownType<number> | null,
    identityNumber?:string | null,
    identityImg?:string | null,
    city?:DropdownType<number> | null,
    career?:DropdownType<number>  | null,
    crtdAt?:string | null,
    organizationDetails?:APILoginOrganizationDetailsResponseType | null,
    profileStatusCode:number,
    profileStatus:AccountStatusType
};


   
interface APIUserResponseType{
    id:String,
    isSuperUser:boolean,
    email?:string | null,
    phoneNumber:string,
    personImg?:string  | null,
    identity?:DropdownType<number> | null,
    identityNumber?:string | null,
    identityImg?:string | null,
    city?:DropdownType<number> | null,
    lockoutEnd?:string,
    lockoutEnabled:boolean,
    accessFailedCount?:number,
    crtdAt?:string | null,
    lastLogin?:string | null,
    lastLogOut?:string | null,
    profiles:Array<APIUserProfileType>
};


interface APIRegionResponseType extends DropdownType<number>{
cities:Array<DropdownType<number>>,
};

interface APIGlobalSettingsResponseType{
    otpLength:number,
    oldUserSessionsRemoveEnabled:boolean,
    passwordMinLength:number,
    passwordMaxLength:number,
    complexPasswordEnabled:boolean,
    misLoginCount:number
};


export type {
    APIResponseType,
    APIErrorFieldType,
    APILoginResponseType,
    APILoginUserDetailsResponseType,
    APILoginOrganizationDetailsResponseType,
    APIVerifyUserResponseType,
    APICollectionResponseType,
    APIUserProfileType,
    APIUserResponseType,
    APIRegionResponseType,
    APIGlobalSettingsResponseType
};
