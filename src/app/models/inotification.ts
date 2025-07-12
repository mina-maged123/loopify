export interface INotification {
    isSuccess: boolean;
    data: {
        userId: number;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }[];
    errorcode: number;
    message: string;
}
