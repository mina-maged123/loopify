export interface IAddReport {
    isSuccess: boolean,
    data: {
        id: number,
        issueType: string,
        pickupId: string,
        description: string,
        reportedBy: string,
        reportedAt: Date,
        status: string,
    },
    errorcode: number,
    message: string
}
