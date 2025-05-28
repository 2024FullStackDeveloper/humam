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
crNumber:string,
crNumberImg:string
};

interface APICollectionResponseType<T>{
    count:number,
    numberOfPages:number,
    resultSet:Array<T> | null
};

interface APILoginUserDetailsResponseType{
    id:string,
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
    lastLogOut?:string | null,
    crtdBy?:string | null
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
    profileStatus:AccountStatusType,
    isOnline:boolean,
    mainServices?:Array<number> | null,
};


   
interface APIUserResponseType{
    id:string,
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
    misLoginCount:number,
    maxDistanceBetween?:number,
};

enum CategoryTypes{
    identity = 1,
    career
}

export enum RoleTypes{
    client = 1,
    admin = 4,
    worker = 2,
    organization = 3
}

interface SubCategoryType extends DropdownType<number>{
    mainCategoryId:number,
    orderValue:number
};

interface APICategoryResponseType extends DropdownType<CategoryTypes>{
 subs?:Array<SubCategoryType>
}


interface APIUserResponse2Type{
    id:string,
    profileId:number,
    role:RoleType,
    isSuperUser:boolean,
    fullName:string,
    email?:string | null,
    phoneNumber:string,
    personImg?:string  | null,
    identity?:DropdownType<number> | null,
    identityNumber?:string | null,
    identityImg?:string | null,
    city?:DropdownType<number> | null,
    mainServices?:Array<number> | null
    organizationDetails?:APILoginOrganizationDetailsResponseType | null,
    crtdAt?:string | null,
    lastLogin?:string | null,
    lastLogOut?:string | null,
    crtdBy?:string | null
   };


interface APIAboutAppResponseType{
    arContent:string,
    enContent:string,
};


   
interface APIMainServiceResponseType{
    id:number,
    arDesc:string,
    enDesc:string,
    serviceImg?:string | null,
    stopEnabled:boolean,
};



interface APISubServiceResponseType{
    id:number,
    arDesc:string,
    enDesc:string,
    arDetails?:string,
    enDetails?:string,
    subServiceImg?:string | null,
    stopEnabled:boolean,
    mainServiceId:number
}

interface APIServiceDetailsResponseType{
    id:number,
    arDesc:string,
    enDesc:string,
    arDetails?:string,
    enDetails?:string,
    serviceImg?:string | null,
    stopEnabled:boolean,
    subServiceId:number,
    countable:boolean,
    offerId?:number,
    discountRate?:number,
    priceAfterDiscount?:number,
}

interface APIProviderServiceItemBaseeRsponseType{
    serviceId:number,
    stopEnabled:boolean
}


interface APIProviderServiceItemResponseType extends APIProviderServiceItemBaseeRsponseType{
    id:number,
}


interface APIServiceItemResponseType{
    id:number,
    arDesc:string,
    enDesc:string,
    serviceImg?:string | null,
}


interface APISubServiceItemResponseType  extends APIServiceItemResponseType{
    serviceDetailsList?:Array<APIServiceItemResponseType>,
}

interface APIServiceInfoResponseType extends APIServiceItemResponseType{
    subServiceList?:Array<APISubServiceItemResponseType>,
}


interface APIProviderServiceResponseType{
    mainServices?:Array<APIProviderServiceItemResponseType>,
    subServices?:Array<APIProviderServiceItemResponseType>,
    servicesDetails?:Array<APIProviderServiceItemResponseType>,
}



export enum SocialMediaType  {
    facebook = 1,
    x,
    instagram,
    linkedIn,
    youTube,
    gmail
}

interface APISocialMediaResponseType {
    id:number,
    socialMediaTypeId:SocialMediaType,
    url:string,
    crtdBy?:string | null,
    mdfBy?:string | null,
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
}



interface APIContactUsResponseType {
    id:number,
    phoneNumber:string,
    crtdBy?:string | null,
    mdfBy?:string | null,
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
}

interface APICommonQuestionsResponseType {
    id:number,
    arQuestion:string,
    enQuestion:string,
    arAnswer:string,
    enAnswer:string,
    crtdBy?:string | null,
    mdfBy?:string | null,
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
}

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
    APIGlobalSettingsResponseType,
    CategoryTypes,
    APICategoryResponseType,
    SubCategoryType,
    APIUserResponse2Type,
    APIAboutAppResponseType,
    APIMainServiceResponseType,
    APISubServiceResponseType,
    APIServiceDetailsResponseType,
    APIProviderServiceResponseType,
    APIProviderServiceItemResponseType,
    APIServiceInfoResponseType,
    APIServiceItemResponseType,
    APISubServiceItemResponseType,
    APIProviderServiceItemBaseeRsponseType,
    APISocialMediaResponseType,
    APICommonQuestionsResponseType,
    APIContactUsResponseType
};
