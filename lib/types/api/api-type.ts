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

interface APIPermissionType{
id:number,
arDesc:string,
enDesc:string,
claimType:string,
claimValue:boolean
}

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
    crtdBy?:string | null,
    permissions?:Array<APIPermissionType> | null
   };


interface APIUserProfileType{
    profileId:number,
    fullName:string,
    role:RoleType,
    identity?:DropdownType<number> | null,
    identityNumber?:string | null,
    identityImg?:string | null,
    city?:DropdownType<number> | null,
    crtdAt?:string | null,
    organizationDetails?:APILoginOrganizationDetailsResponseType | null,
    profileStatusCode:number,
    profileStatus:AccountStatusType,
    isOnline:boolean,
    isActive:boolean,
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
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
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


interface APIProfileType{
id: number,
name: string,
isCompany: boolean,
personImg?: string | null,
email?: string | null,
phoneNumber:string,
city?:DropdownType<number> | null,
isOnline: boolean,
isActive:boolean,
arAddress?: string,
enAddress?: string,
latitudes?:number | null,
longitudes?:number | null
}


interface APIOfferProvider extends Partial<APIProfileType>{
    providerOfferId:number,
    offerId:number
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


interface APIAdsResponseType {
    id:number,
    arTitle:string,
    enTitle:string,
    arContent?:string | null,
    enContent?:string | null,
    endExclusiveTimeStamp?: number | null,
    endTimeStamp?: number | null,
    thumbnail?:string | null,
    background?:string | null,
    showInMainSlider:boolean,
    showInSubSlider:boolean,
    stopEnabled:boolean,
    serviceProviders?:Array<APIProfileType>
    crtdBy?:string | null,
    mdfBy?:string | null,
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
}


interface APIOfferResponseType{
    id:number,
    arDesc:string,
    enDesc:string,
    arContent?:string | null,
    enContent?:string | null,
    backgroundImg?:string | null ,
    discountRate : number,
    includeSpares:boolean,
    includeTransportation:boolean,
    startTimeStamp?:number | null,
    endTimeStamp?:number | null,
    stopEnabled:boolean,
    crtdBy?:string | null,
    mdfBy?:string | null,
    crtdAt?:string | null,
    lastUpdateAt?:string | null,
}


interface APIOfferSubServiceProviderResponseType {
    id:number,
    providerOfferId:number,
    subServiceProviderId:number,
    subServiceDetails?:{
        mainServiceId:number,
        mainServiceArDesc?:string,
        mainServiceEnDesc?:string,
        id:number,
        arDesc:string,
        enDesc:string,
        arDetails?:string | null,
        enDetails?:string | null,
        subServiceImg?:string | null,
        stopEnabled:boolean,
        crtdAt?:string,
        crtdBy?:string,
        mdfBy?:string | null,
        lastUpdateAt?:string | null
    }
}

interface APIProviderServiceType extends APIServiceItemResponseType{
  subServiceList?:Array<APIServiceItemResponseType> | null
}


enum InvoiceStatusTypes
{
Pending = 1,
Paid = 2,
Canceled =3
}


enum PaymentTypes
{
Cash = 1,
Card
}


enum TransactionTypes
{
Pending = 1,
Completed 
}


interface APIShortProviderInfoResponseType{
    id:number,
    name:string,
    isCompany:boolean,
    personImg?:string,
    email?:string,
    phoneNumber:string
}


interface APITransactionProfitResponseType{
   id:number,
   providerInfo?:APIShortProviderInfoResponseType,
   providerPercentage?:number,
   providerProfit?:number,
   platformProfit?:number,
   isTransfered:boolean,
   crtdBy?:string  | null ,
   crtdAt?:string | null ,
   mdfBy?:string | null ,
   lastUpdateAt?:string | null
}


interface APIWalletResponseType{
   id:string,
   pendingProfit?:number | null,
   receivingProfit?:number | null,
   balance?:number
}



interface APITransactionResponseType{
id:number,
orderId:number,
invoiceId?:string | null ,
invoiceStatus : InvoiceStatusTypes,
customerReference?:string,
invoiceReference?:string,
displayCurrencyIso?:string,
serviceAmount?:number,
totalAmount?:number,
paymentMethod:PaymentTypes,
profits?:APITransactionProfitResponseType | null,
electronicPaymentMethod ?: number | null,
transactionReference?:string | null,
customerServiceCharge?:number | null ,
totalServiceCharge?:number | null ,
transactionDate?:string | null,
expiryDate?:string | null ,
expiryTime?:string | null,
vatAmount?:number | null ,
dueValue?:number | null ,
paymentDate?:string | null ,
status?:TransactionTypes | null,
crtdBy?:string  | null ,
crtdAt?:string | null ,
mdfBy?:string | null ,
lastUpdateAt?:string | null
}


export interface BaseEntity {
crtdBy?:string  | null ,
crtdAt?:string | null ,
mdfBy?:string | null ,
lastUpdateAt?:string | null
}

export interface ClientCoordsResponseType extends BaseEntity {
  coordsId: number;
  isDefault: boolean;
  latitudes: number;
  longitudes: number;
  arAddress?: string | null;
  enAddress?: string | null;
}

export interface PersonResponseType {
  profileId: number;
  personImg?: string | null;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
}


export interface ServiceProviderResponseType {
  profileId: number;
  personImg?: string | null;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  isCompany: boolean;
  companyName?: string | null;
}

export interface ClientSubServiceResponseType {
  id: number;
  arDesc: string;
  enDesc: string;
  subServiceImg?: string | null;
  offerId?: number | null;
  discountRate?: number | null;
}

export enum OrderPhaseTypes
{
    ReceivedOrder = 1,
    Preparation,
    OnRoad,
    OnSite,
    Progress,
    Completed,
    Paid,
    ConfirmPayment
}

export enum ServiceTimeTypes
{
Now = 1,
Later
}


export enum OrderStatusTypes
{
Waiting = 1,
Pending,
Approved,
Rejected,
Canceled,
CompletedPaid
}

export interface InvoiceDto {
  invoiceId: string | null;
  invoiceStatus: InvoiceStatusTypes;
  customerReference: string;
  invoiceReference: string | null;
  displayCurrencyIso: string | null;
  serviceProviderAmount: number;
  serviceTotalAmount: number;
  paymentMethod: PaymentTypes;
  electronicPaymentMethod: number | null;
  expiryDate: string | null;
  expiryTime: string | null; // TimeSpan represented as string (e.g., "02:30:00")
  canRecreate: boolean;
  transactionReference: string | null;
  transactionDate: string;
  paymentDate: string | null;
  paidCurrencyIso: string | null;
  customerServiceCharge: number;
  totalServiceCharge: number;
  vatAmount: number;
  dueValue: number;
  paymentUrl: string | null;
}

 export interface DetailsDto {
  serviceDetails: ClientServiceResponseType;
  serviceProviderAmount?: number | null;
  serviceTotalAmount?: number | null;
  paymentMethod?: PaymentTypes | null;
  paymentAmount?: number | null;
  paymentAt?: Date | null;
  invoice?: InvoiceDto | null;
}

export interface ClientServiceResponseType {
  id: number;
  arDesc: string;
  enDesc: string;
  serviceImg?: string | null;
  subServices: ClientSubServiceResponseType[]; 
}

export interface PhaseResponseType{
    phase:OrderPhaseTypes,
    completed:boolean,
    completedAt?:string | null
}

 interface SendServiceOrderResponseDto extends BaseEntity {
  orderId: number;
  coords: ClientCoordsResponseType;
  client: PersonResponseType;
  serviceProvider: ServiceProviderResponseType;
  orderDetails: DetailsDto;
  extraServices?: string[];
  phases?: PhaseResponseType[];
  videoRecordingPath?: string | null;
  voiceRecordingPath?: string | null;
  attachments?: string[]; // Fixed typo from "Attatchments"
  serviceTimeImplementation: ServiceTimeTypes;
  serviceTime: string; // TimeSpan as string (e.g., "02:30:00")
  arrivalTime?: string | null; // TimeSpan as nullable string
  serviceStatus: OrderStatusTypes;
  whenChangeStatusAt?: Date | null;
  chatEnabled: boolean;
  serviceEvaluation?: number | null;
  evaluationContent?: string | null;
  notes?: string | null;
}

interface APIDashboardResponseType {
    wallet?: APIWalletResponseType | null, 
    clientsCount?: number | null,
    workerProvidersCount?: number | null,
    organizationProvidersCount?: number | null,
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
    APIContactUsResponseType,
    APIAdsResponseType,
    APIProfileType,
    APIOfferResponseType,
    APIOfferProvider,
    APIOfferSubServiceProviderResponseType,
    APIProviderServiceType,
    APITransactionResponseType,
    APITransactionProfitResponseType,
    APIShortProviderInfoResponseType,
    TransactionTypes,
    PaymentTypes,
    InvoiceStatusTypes,
    APIWalletResponseType,
    SendServiceOrderResponseDto,
    APIDashboardResponseType
};
