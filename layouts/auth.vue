<template>
  <div>
    <main>
      <div class="h-screen">
        <div class="flex">
          <div 
            class=
              "h-screen
              hidden
              lg:w-[50%] 
              bg-[url('/snap-bg.jpg')] 
              bg-cover 
              bg-center 
              bg-no-repeat 
              lg:flex 
              items-center 
              justify-center"
          >
            <div class="bg-black h-screen w-[100%] bg-opacity-80 flex items-center justify-center">
              <div class="lg:w-[50%] py-4 px-8 opacity-80 rounded-[5em]">
                <img src="/snapbill-logo.png"/>
              </div>
            </div>
          </div>
          <div class="flex justify-center m-auto items-center lg:w-[50%] ">
            <div class="">
              <slot class="" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
