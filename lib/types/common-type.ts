import { APICollectionResponseType, APIErrorFieldType, APIResponseType } from "./api/api-type"
import { SortedStatusType } from "./api/status-type"

interface DropdownType<T> {
    id: T,
    arDesc: string,
    enDesc?: string,
    addational?:any
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
    sortedType: SortedStatusType
    sortedField?: string
};


interface CoreStateType<T>{
    isPending:boolean,
    message?:string | null,
    code?:number | null,
    isServerOn: boolean,
    serverOffMessage?: string,
    fields?:Array<APIErrorFieldType> | null,
    result?:GlobalResponseType<APIResponseType<APICollectionResponseType<T | undefined>>>,
};


interface InputControlType {
      containerClass?:string,
      label: string,
      error?: string,
      prefixicon: React.ReactNode,
}

type VariantButtomType = "default" | "destructive" | "ghost" | "secondary" | "warningOutline" | "dangerOutline" | "idleOutline" | "successOutline" | "infoOutline" | "none";



export type {
    DropdownType,
    GlobalResponseType,
    ValidationType,
    RouteType,
    PaginateType,
    CoreStateType,
    VariantButtomType,
    InputControlType
};
