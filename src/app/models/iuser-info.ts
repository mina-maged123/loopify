export interface IUserInfo {
    isSuccess: boolean,
    data: {
        id: number,
        fullName: string,
        email: string,
        phoneNumber: string,
        totalPoints:number,
        address: string,
        profilePictureUrl: string,
        createdAt: Date,
    },
    errorcode: number,
    message: string
}
