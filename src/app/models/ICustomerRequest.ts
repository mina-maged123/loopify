import { ICustomerRequestItem } from "./ICustomerRequestItem";

export interface ICustomerRequest {
    id:number,
    requestedDate: string,
    status: string,
    totalPointsGiven:number,
    materialWithQuantity: ICustomerRequestItem[],
}