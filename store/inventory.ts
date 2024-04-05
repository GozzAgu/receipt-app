import type { Inventory } from "~/types/types"

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
      inventory: [
        {
            dateIn: '1/13/2024',
            supplier: 'Hassan Mohuied',
            grade: 'Used',
            storage: '8GB/512GB',
            imei: '5CG71657NK',
            colour:'Silver',
            amount: 50000,
            cost: 250,
            margin: 50000,
            swap: 'no',
            dateOut:'2/22/2024'
        },
        {
            dateIn: '2/12/2024',
            supplier: 'Hassan Mohuied',
            grade: 'New',
            storage: '8GB/512GB',
            imei: '7CG716357QK',
            colour:'Silver',
            amount: 20000,
            cost: 250,
            margin: 50000,
            swap: 'no',
            dateOut:'2/22/2024'
        },
        {
            dateIn: '3/10/2024',
            supplier: 'Hassan Mohuied',
            grade: 'New',
            storage: '8GB/512GB',
            imei: '3CE62657BK',
            colour:'Silver',
            amount: 50500,
            cost: 250,
            margin: 50000,
            swap: 'yes',
            dateOut:'2/22/2024'
        },
        {
            dateIn: '2/12/2024',
            supplier: 'Hassan Mohuied',
            grade: 'Used',
            storage: '8GB/512GB',
            imei: '5AD71657PD',
            colour:'Silver',
            amount: 52000,
            cost: 250,
            margin: 50000,
            swap: 'no',
            dateOut:'2/22/2024'
        }
      ] as Inventory[]
    }),
  
    actions: {
        addToInventory(entry:Inventory){
            this.inventory.push(entry)
        },

        editInventory(entry:Inventory){
            const idx = this.inventory.findIndex(e => e.imei === entry.imei)
            this.inventory[idx] = entry
        },

        searchInventoryByIMEI(imei: string){
            return this.inventory.find(item => item.imei === imei)
        }
    }
})