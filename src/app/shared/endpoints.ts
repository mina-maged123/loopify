export const baseUrl = "https://recyclingsystem.runasp.net/api/";
export const ENDPOINTS = {
    LOGIN: `${baseUrl}Account/login`,
    REGISTER: `${baseUrl}Account/register`,


    GET_ALL_MATERIAL: `${baseUrl}Material/all`,
    GET_MATERIAL: (materialId:number) => `${baseUrl}Material/${materialId}`,
}