<template>
  <div>
    <section class="">
      <div class="">
        <div class="">
          <h2 class="">Login</h2>
          <p class="subtitle error-msg">{{ errorMsg }}</p>
        </div>
      </div>
    </section>
    <section class="">
      <div class="">
        <div class="">
          <label class="" for="username">Username:</label>
          <div class="">
            <input class="" id="username" v-model="username" @keyup.enter="authenticate">
          </div>
        </div>
        <div class="">
          <label class="" for="password">Password:</label>
          <div class="">
            <input type="password" class="" id="password" v-model="password" @keyup.enter="authenticate">
          </div>
        </div>
        <div class="control">
          <button class="" id="login" @click="authenticate">Login</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import api from '@/api'

export default {
  data () {
    return {
      username: '',
      password: '',
      errorMsg: ''
    }
  },
  mounted () {
    if (api.isAuthenticated()) {
      this.$router.push('/')
    }
  },
  methods: {
    authenticate () {
      api.login(this.username, this.password)
      .then(() => {
        this.$router.push('/')
      })
      .catch(err => {
        this.errorMsg = err
      })
    }
  }
}
</script>
<style scoped>
#login {
  margin: 2em;
}
</style>