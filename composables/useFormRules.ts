import type { FormRules } from 'element-plus'

// validation rules for setup form
export const addInventoryRules: FormRules = {
  supplier: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  imei: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  storage: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  colour: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  amount: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  cost: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  margin: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  dateIn: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  dateOut: [
    { required: false, trigger: 'change' },
  ],
  grade: [
    { required: true, message: 'Required', trigger: 'change' },
  ],
  swap: [
    { required: true, message: 'Required', trigger: 'change' },
  ]
}