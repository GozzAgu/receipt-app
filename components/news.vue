<template>
  <div class="pt-[4em] px-[1em] bg-slate-100">
    <p class="font-semibold text-sky-600 mb-[1em]">Latest News</p>

    <div v-if="articles" class="grid grid-cols-2 gap-[1em]">
      <div class="shadow-md mb-[1em] p-[1em] bg-white rounded-xl" v-for="article in articles">
        <p class="line-clamp-3 font-semibold text-sm">{{ article.title }}</p>
        <img class="mt-[2em]" :src="article.image" />
      </div>
    </div>

    <div v-else class="loader m-auto py-[3em]"></div>
  </div>
</template>

<script setup>
import axios from 'axios';

const pageSize = ref(10)
const currentPage = ref(1)

const apiKey = ref('8ebfb4eaec9502a6c5ad4a5977bfddea')
const apiKey2 = ref('5de888a1c14b419bade185edee835a7d')
const apiKey3 = ref('pub_380894594ec8d5990b797d45b3a894cd9b4e4')
const baseUrl = ref(`https://gnews.io/api/v4/top-headlines?category=general&apikey=${apiKey.value}&page=${pageSize.value}&pageSize=${currentPage.value}`)
const baseUrl2 = ref(`https://newsapi.org/v2/everything?q=bitcoin&apiKey=${apiKey2.value}`)
const baseUrl3 = ref(`https://newsdata.io/api/1/news?apikey=${apiKey3.value}`)

const articles = ref('')

const fetchNews = async() => {
  const params = {
    lang: 'en',
  }

  await axios.get(baseUrl.value, {params})
  .then(response =>  {
    articles.value = response.data.articles
    console.log(articles.value)
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

const nextPage = async() => {
  currentPage.value ++
  await fetchNews()
}

const prevPage = async() => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchNews();
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 60px;
  aspect-ratio: 4;
  --c:#000 90%,#0000;
  background: 
    radial-gradient(circle closest-side at left  6px top 50%,var(--c)),
    radial-gradient(circle closest-side                     ,var(--c)),
    radial-gradient(circle closest-side at right 6px top 50%,var(--c));
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: l4 1s infinite alternate;
}
@keyframes l4 {
    to{width:25px;aspect-ratio: 1}
}
</style>