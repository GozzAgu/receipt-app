<template>
  <div class="most-demanded-products mb-4">
    <h2 class="text-xs md:text-sm font-light">Your Most Sold Product is
      <span v-if="mostSoldProduct" class="product-demand">
        <span class="text-orange-500 font-semibold">{{ mostSoldProduct.name }}</span>
        and you have sold
        <span class="text-orange-500 font-semibold">{{ mostSoldProduct.count }}</span>
      </span>
    </h2>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useInventoryStore } from "~/store/inventory";

const inventoryStore = useInventoryStore();
const { inventories } = toRefs(inventoryStore)

const soldProductFrequencies = computed(() => {
  return inventories.value.reduce((acc, inventory) => {
    if (inventory.sold) {
      const productName = inventory.product;
      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName]++;
    }
    return acc;
  }, {});
});

// Get the most sold product
const mostSoldProduct = computed(() => {
  const sortedProducts = Object.entries(soldProductFrequencies.value)
    .sort(([, countA], [, countB]) => countB - countA);
  
  if (sortedProducts.length > 0) {
    const [name, count] = sortedProducts[0];
    return { name, count };
  }
  
  return null;
});

</script>
