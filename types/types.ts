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

export interface userAuth {
  email: string,
  password: string
}

export interface ReceiptPasswordReset {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

export interface ReceiptPassword {
  newPassword: string,
  confirmNewPassword: string
}