export enum AccountType {
  Admin = 'admin',
  Manager = 'manager'
}

export interface Receipt {
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
  id: string,
  adminId: string | undefined,
  email: string,
  password: string,
  accountType: AccountType.Manager
}

export interface ManagerAuth {
  username: string,
  password: string
}

export interface Admin {
  adminId: string | undefined,
  name: string,
  email: string,
  password: string,
  accountType: AccountType.Admin
}

export interface SigninUser {
  email: string,
  password: string,
  accountType: AccountType
}

export interface Inventory{
  dateIn: string,
  supplier: string,
  grade: 'New' | 'Used',
  storage: string,
  imei: string,
  colour:string,
  amount: null | number,
  cost: null | number,
  margin: null | number,
  swap: 'yes' | 'no',
  dateOut: string
}