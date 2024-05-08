<script setup>
  import { User, Lock } from '@element-plus/icons-vue'
  import { ref,  watch } from 'vue'
  import { userLoginService, userRigisterService } from '@/api/user';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';

  const isRegister = ref(true)
  const form = ref(null)

  const userStore = useUserStore()
  const router = useRouter()

  // 提交对象
  let formModel  = ref({
    username:'',
    password:'',
    repassword:''
  })

  //表单校验规则
  const rules = {
    username:[
      {required: true, message: '请输入用户名'},
      {min: 3, max: 10, message: '长度必须为3-10位'}
    ],
    password:[
      {required: true, message: '请输入密码'},
      {pattern:/^\S{6,12}$/, message: '密码应为6-12位非空字符串'}
    ],
    repassword:[
      {required: true, message: '请输入密码'},
      {pattern:/^\S{6,12}$/, message: '密码应为6-12位非空字符串'},
      {validator: (rule, value, callback) => {
          if(value!==formModel.value.password){
            callback(new Error('两次密码不一致'))
          }else {
            callback()
          }
        }
      }
    ]
  }

  // 注册事件
  const register = async () => {
    await form.value.validate()
    await userRigisterService(formModel)
    .then(resp =>{
      console.log(resp);
      isRegister.value = true
    })
    .catch(error => {
      console.log(error);
    })
  }

  // 登录事件
  const login = () => {
    form.value.validate()
    userLoginService(formModel)
    .then(resp =>{
      console.log(resp);
      userStore.setToken(resp.data.token)
      router.push('/')
    })
    .catch(error => console.log(error))
  }

  // 监视 注册/登录 切换
  watch(isRegister,()=>{
    console.log(formModel);
    // eslint-disable-next-line no-const-assign
    formModel.value  = {
      username:'',
      password:'',
      repassword:''
    }
  })
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form ref="form" size="large" autocomplete="off" v-if="!isRegister" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="formModel.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="formModel.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="formModel" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            v-model="formModel.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
      background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
        url('@/assets/login_bg.jpg') no-repeat center / cover;
      border-radius: 0 20px 20px 0;
    }

    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      user-select: none;

      .title {
        margin: 0 auto;
      }

      .button {
        width: 100%;
      }

      .flex {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>