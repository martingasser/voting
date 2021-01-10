<template>
  <div class="">
    <div v-if="voteAllowed">
      <div v-for="choice in choices" :key="choice">
        <input type="radio" :value="choice" v-model="userChoice" name="choice">
        <label :for="choice">{{choice}}</label>
      </div>
      <button id="vote" @click="vote" :disabled="userChoice == null">Vote!</button>
    </div>
    <div v-else>
      <table id="votes">
        <tr v-for="choice in choices" :key="choice">
          <td>{{choice}}</td>
          <td>{{votes[choice]}}</td>
        </tr>
      </table>
    </div>
    <button id="logout" @click="logout">Logout</button>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'Home',
  data () {
    return {
      choices: [],
      userChoice: null,
      votes: {},
      voteAllowed: true
    }
  },
  mounted () {
    api.choices()
      .then(choices => {
        this.choices = choices
      })
      .catch(() => {
        this.$router.push('/login')
      })
    
    api.allowed()
    .then(response => {
      if (response.message != 'Ok') {
        this.voteAllowed = false
        this.getVotes()
      }
    })
  },
  methods: {
    vote () {
      api.vote(this.userChoice)
        .then(() => {
          this.voteAllowed = false
          this.getVotes()
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    getVotes () {
      api.votes()
      .then(votes => {
        this.votes = votes
      })
    },
    logout () {
      api.logout()
      this.$router.push('/login')
    }
  },
}
</script>
<style>
input {
  text-align: center;
}

#vote {
  margin: 1em;
}

#logout {
  margin: 2em;
}

#votes {
  margin: auto;
}
</style>