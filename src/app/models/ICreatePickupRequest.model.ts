import { ICraetePickupItem } from "./ICreatePickupItem.model";

export interface ICreatePickupRequest{
    address:string,
    latitude:string,
    longitude:string,
    preferredDate:string,
    note:string,
    pickupItems: ICraetePickupItem[]
}