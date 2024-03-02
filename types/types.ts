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
}

export interface userAuth {
  email: string,
  password: string
}

export interface ForgotPassword {
  email: string,
}