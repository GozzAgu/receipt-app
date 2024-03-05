export enum AccountType {
  Admin = 'admin',
  Manager = 'manager'
}

export interface RuleForm {
  id: string,
  customerName: string
  customerAddress: string
  customerNumber: string
  name: string
  address: string
  productName: string
  productDescription: string
  productQuantity: number
  productPrice: number
  newPrice: number
  date: string
  receiptOf: string
  imei: string
  paidVia: string
  swapFrom: string
}

// export interface userAuth {
//   email: string,
//   password: string
//   accountType: AccountType.Admin | AccountType.Manager
// }

export interface User {
  email: string,
  name: string,
  phone: string
}

export interface ReceiptPasswordReset {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

export interface Manager {
  adminId: string,
  email: string,
  password: string,
  accountType: AccountType.Manager
}