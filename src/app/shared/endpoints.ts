export const baseUrl = "https://recyclingsystem.runasp.net/api/";
export const ENDPOINTS = {
    LOGIN: `${baseUrl}Account/login`,
    REGISTER: `${baseUrl}Account/register`,


    GET_ALL_MATERIAL: `${baseUrl}Material/all`,
    GET_MATERIAL: (materialId:number) => `${baseUrl}Material/${materialId}`,

    GET_USER: (userId:number) => `${baseUrl}User/${userId}`,
    CHECK_EMAIL : `${baseUrl}User/CheckEmail`,
    CHANGE_PASSWORD: `${baseUrl}User/ChangePassword`,
    UPDATE_USER: `${baseUrl}User`,

    POST_PICKUP_REQUEST: `${baseUrl}PickupRequest`,

    GET_NOTIFICATIONS: `${baseUrl}api/Notification`,
}