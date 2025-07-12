import { ICustomerRequestItem } from "./ICustomerRequestItem";

export interface ICustomerRequest {
    id:number,
    requestedDate: string,
    status: string,
    materialWithQuantity: ICustomerRequestItem[],
}