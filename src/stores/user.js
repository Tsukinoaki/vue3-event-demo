import {  defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('event-user',()=>{
  const token = ref(null)
  const setToken = (newToken) => token.value = newToken
  const removeToken = ()=> token.value = ''

  return {
    token,
    setToken,
    removeToken
  }
},{
  persist:true
})