<template>
    <div>
      <div class="i-fluent:person-star-24-regular h6 w6 text-e-primary" />
      <h3 class="title">
        Add New Entry
      </h3>
      <div class="info">
        <Icon name="fluent:info-24-regular" class=" h-4 w-4 mr-2 shrink-0 mt-0.5 text-[#409eff]" />
        <p>Fill in the details of a new entry and it will automatically be added to the inventory</p>
      </div>
  
      <div class="add-admin--body">
        <div class="body">
          <el-form
            ref="addEntryRef"
            label-width="auto"
            label-position="top"
            :model="newInventoryData"
            :rules="addInventoryRules"
            size="large"
            :hide-required-asterisk="true"
          >
            <div>
              <div class="flex gap-x-8 w-full px-2">
                  <el-form-item
                  prop="supplier"
                  class="w-full"
                  :rules="addInventoryRules.supplier"
                  >
                      <template #label>
                      <p class=" -mb-1.5 font-light">
                          Supplier Name
                      </p>
                      </template>
                      <el-input
                      v-model="newInventoryData.supplier"
                      type="text"
                      placeholder="Supplier"
                      />
                  </el-form-item>
                  <el-form-item
                    prop="product"
                    class="w-full"
                    :rules="addInventoryRules.product"
                    >
                        <template #label>
                        <p class=" -mb-1.5 font-light">
                            Product Name
                        </p>
                        </template>
                        <el-input
                        v-model="newInventoryData.product"
                        type="text"
                        placeholder="Product"
                      />
                  </el-form-item>
              </div>
              <div class="flex gap-x-8 w-full px-2">
                <el-form-item
                  prop="imei"
                  class="w-1/2"
                  :rules="addInventoryRules.imei"
                >
                  <template #label>
                    <p class=" -mb-1.5 font-light">
                      IMEI
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.imei"
                    type="text"
                    placeholder="IMEI"
                  />
                </el-form-item>
  
                <el-form-item
                  prop="storage"
                  class="w-1/2"
                  :rules="addInventoryRules.storage"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Storage
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.storage"
                    type="text"
                    placeholder="Storage"
                  />
                </el-form-item>
              </div>

              <div class="flex gap-x-8 w-full px-2">
                <el-form-item
                  prop="dateIn"
                  class="w-1/2"
                  :rules="addInventoryRules.dateIn"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Date In
                    </p>
                  </template>
                  <el-date-picker
                    v-model="newInventoryData.dateIn"
                    type="date"
                    placeholder="Pick a date"
                    value-format="M/DD/YYYY"
                    />
                </el-form-item>
  
                <el-form-item
                  prop="dateOut"
                  class="w-1/2"
                  :rules="addInventoryRules.dateOut"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Date Out
                    </p>
                  </template>
                  <el-date-picker
                    v-model="newInventoryData.dateOut"
                    type="date"
                    placeholder="Pick a date"
                    value-format="M/DD/YYYY"
                    />
                </el-form-item>
              </div>
  
              <div class="flex gap-x-8 w-full px-2">
                <el-form-item
                  prop="colour"
                  class="w-1/2"
                  :rules="addInventoryRules.colour"
                >
                  <template #label>
                    <p class=" -mb-1.5 font-light">
                      Colour
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.colour"
                    type="text"
                  />
                </el-form-item>
  
                <el-form-item
                  prop="amount"
                  class="w-1/2"
                  :rules="addInventoryRules.amount"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Amount
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.amount"
                    type="number"
                  />
                </el-form-item>
              </div>

              <div class="flex gap-x-8 w-full px-2">
                <el-form-item
                  prop="cost"
                  class="w-1/2"
                  :rules="addInventoryRules.cost"
                >
                  <template #label>
                    <p class=" -mb-1.5 font-light">
                      Cost
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.cost"
                    type="number"
                  />
                </el-form-item>
  
                <el-form-item
                  prop="margin"
                  class="w-1/2"
                  :rules="addInventoryRules.margin"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Margin
                    </p>
                  </template>
                  <el-input
                    v-model="newInventoryData.margin"
                    type="number"
                  />
                </el-form-item>
              </div>
  
              <div class="flex gap-x-8 w-full px-2">
                <el-form-item
                  prop="grade"
                  class="w-1/2"
                  :rules="addInventoryRules.grade"
                >
                  <template #label>
                    <p class=" -mb-1.5 font-light">
                      Grade
                    </p>
                  </template>
                  <el-select
                    v-model="newInventoryData.grade"
                    filterable
                    placeholder="Grade"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in grade"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
  
                <el-form-item
                  prop="swap"
                  class="w-1/2"
                  :rules="addInventoryRules.swap"
                >
                  <template #label>
                    <p class="-mb-1.5 font-light">
                      Swap
                    </p>
                  </template>
                  <el-select
                    v-model="newInventoryData.swap"
                    filterable
                    placeholder="Swap"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in swap"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
  
        <div class="flex gap-x-3 justify-end px-2 my-4">
          <el-button
            type="info"
            class="w-max"
            :disabled="loading"
            @click="$emit('close-drawer')"
          >
            Cancel
          </el-button>
  
          <el-button
            type="primary"
            class="min-w-20"
            :loading="loading"
            @click="addNewEntry(addEntryRef)"
          >
            <template #loading>
              <div class="i-svg-spinners:3-dots-move h3" />
            </template>
            {{ loading ? '' : 'Add' }}
          </el-button>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { Inventory } from "~/types/types"
import { useInventoryStore } from '~/store/inventory';

const emit = defineEmits(['close-drawer'])

const inventoryStore = useInventoryStore();
const { addToInventory } = inventoryStore

const addEntryRef = ref()
const loading = ref(false)

// Get today's date
const today = new Date();

// Get the components of the date
const month = ref(today.getMonth() + 1); // Months are zero-based, so add 1
const day = ref(today.getDate());
const year = ref(today.getFullYear());

// Format the date as "m/dd/yyyy"
const formattedDate = computed<string>(()=> `${month.value}/${day.value}/${year.value}`) ;

const newInventoryData = ref({
  dateIn: formattedDate.value,
  supplier: '',
  product: '',
  grade: '',
  storage: '',
  imei: '',
  colour:'',
  amount: null,
  cost: null,
  margin: null,
  swap: '',
  dateOut:''
})

const grade = ['New', 'Used']
const swap = ['yes', 'no']

function addNewEntry(formInput: FormInstance | undefined) {
  if (!formInput)
    return

  formInput.validate((valid: boolean) => {
    if (valid) {
      loading.value = true

      const newEntry = {
        ...newInventoryData.value
      }

      addToInventory(newEntry as Inventory)
      loading.value = false
      formInput.resetFields()
  }})
}
</script>

<style scoped>
.title{
    @apply mt-2 text-lg text-gray-900
}
.info{
    @apply font-light text-gray-600 p-3 mt-2 mb-3 bg-[#ecf5ff] border-l-[#409eff] border-l-4 rounded flex ;
}
</style>