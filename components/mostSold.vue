<template>
  <div class="most-demanded-products mb-4">
    <h2 class="text-xs md:text-sm font-light">Your Most Sold Product is
      <span v-for="(count, productName) in sortedDemandedProducts" :key="productName" class="product-demand">
        <span class="text-orange-500 font-semibold">{{ productName }}</span> 
        and you have sold 
        <span class="text-orange-500 font-semibold">{{ count }}</span>
      </span>
    </h2>
  </div>
</template>

<script setup lang="ts">
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

// Sort the products based on their frequency
const sortedDemandedProducts = computed(() => {
  const sortedProducts = Object.entries(soldProductFrequencies.value)
    .sort(([, countA], [, countB]) => countB - countA)
    .reduce((acc, [productName, count]) => {
      acc[productName] = count;
      return acc;
    }, {});
  return sortedProducts;
});

</script>