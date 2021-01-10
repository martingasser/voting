const api = {

    baseURL: 'http://localhost:3000',

    isAuthenticated () {
        const user = JSON.parse(localStorage.getItem('user'))
        return (user != null)
    },

    login (username, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }

        return fetch(`${this.baseURL}/login`, requestOptions)
        .then(response => {
            if (response.status === 401) {
                this.logout()
                return Promise.reject(response.statusText)
            }
            return response.json()
        })
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user))
            return `User ${username} logged in`
        })
    },

    logout () {
        localStorage.removeItem('user')
    },

    allowed () {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user === null) {
            return Promise.reject('Not logged in.')
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
        return fetch(`${this.baseURL}/allowed`, requestOptions)
        .then(response => response.json())
    },

    vote (option) {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user === null) {
            return Promise.reject('Not logged in.')
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
        return fetch(`${this.baseURL}/votes/${option}`, requestOptions)
        .then(response => response.json())
    },

    votes () {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user === null) {
            return Promise.reject('Not logged in.')
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
        return fetch(`${this.baseURL}/votes`, requestOptions)
        .then(response => response.json())
    },

    choices () {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user === null) {
            return Promise.reject('Not logged in.')
        }
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        }
        return fetch(`${this.baseURL}/choices`, requestOptions)
        .then(response => response.json())
    }

}

export default api