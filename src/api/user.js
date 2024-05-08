import request from '@/utils/request.js'

export const userRigisterService = ({username, password, repassword}) => {
  return request.post('/api/reg', {username, password, repassword})
}

export const userLoginService = ({username, password}) => {
  return request.post('/api/login',{username, password})
}