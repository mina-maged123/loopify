export interface ResponseGetAll<T> {
  isSuccess: boolean;
  data: T[];
  errorcode: number;
  message: string;
}

