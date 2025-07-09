export interface IRegisterUser {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Address: string | null;
  PhoneNumber: string;
  Password: string;
  ConfirmPassword: string;
}