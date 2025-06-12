import { APICollectionResponseType, APIErrorFieldType, APIResponseType } from "./api/api-type"
import { SortedStatusType } from "./api/status-type"

interface DropdownType<T> {
    id: T,
    arDesc: string,
    enDesc?: string,
    addational?: any
};


interface GlobalResponseType<T> {
    isServerOn: boolean,
    serverOffMessage?: string,
    result?: T | null,
};


interface ValidationType {
    isValid: boolean,
    errorsList?: any
};


interface RouteType {
    id: number,
    title: string,
    route: string,
    icon?: React.ReactNode,
    sub?: Array<RouteType>
};


interface PaginateType {
    paginate: boolean,
    page: number,
    size: number,
    sortedType?: SortedStatusType
    sortedField?: string
};


interface CoreStateType<T> {
    isPending: boolean,
    message?: string | null,
    code?: number | null,
    isServerOn: boolean,
    serverOffMessage?: string,
    fields?: Array<APIErrorFieldType> | null,
    result?: GlobalResponseType<APIResponseType<APICollectionResponseType<T | undefined>>>,
};


interface InputControlType {
    containerClass?: string,
    label: string,
    error?: string,
    prefixicon: React.ReactNode,
}

type VariantButtomType = "default" | "destructive" | "ghost" | "secondary" | "warningOutline" | "dangerOutline" | "idleOutline" | "successOutline" | "infoOutline" | "none";

interface StateResponseType<T> {

    code?: number,
    message?: string | null,
    fields?: Array<APIErrorFieldType> | null,
    data?: T | null,
    isServerOn: boolean,
    serverOffMessage?: string,
};


export interface ServiceTitle {
  ar: string;
  en: string;
}

export interface ServiceDescription {
  ar: string;
  en: string;
}

export interface SubService {
  id: string;
  name: ServiceTitle;
  imageUrl?: string;
  description?: ServiceDescription;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: ServiceTitle;
  description: ServiceDescription;
  level: 'basic' | 'premium';
  price: number;
  isActive: boolean;
  features: string[];
  imageUrl?: string;
  subServices: SubService[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceRequest {
  name: ServiceTitle;
  description: ServiceDescription;
  level: 'basic' | 'premium';
  price: number;
  imageUrl?: string;
  subServices: SubService[];
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export type {
    DropdownType,
    GlobalResponseType,
    ValidationType,
    RouteType,
    PaginateType,
    CoreStateType,
    VariantButtomType,
    InputControlType,
    StateResponseType
};
