// Interface for individual warehouse data
export interface IWarehouseData {
    id: number,
    name: string,
    location: string,
    capacityKg: number,
    managerId: number
}

// Interface for single warehouse response
export interface IWarehouse {
    isSuccess: boolean,
    data: IWarehouseData,
    errorcode: number,
    message: string
}

// Interface for multiple warehouses response
export interface IWarehouseList {
    isSuccess: boolean,
    data: IWarehouseData[],
    errorcode: number,
    message: string
}

