const express = require('express')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')

const path = require('path')
const fs = require('fs').promises

const corsOptions = {
    origin: 'http://localhost:8080'
}

const accessTokenSecret = '#34534s_ß?32...)derwedavcml+++++++'

const usersFilename = path.join('.', 'db', 'users.json')
const votesFilename = path.join('.', 'db', 'votes.json')

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        res.status(401).json({
            message: 'Invalid token.'
        })
    }
}

const voteOnlyOnce = (req, res, next) => {
    const user = req.user
    fs.readFile(usersFilename).then(file => {
        const users = JSON.parse(file)
        const found = users.find(u => { return u.username === user.username && u.voted === false })
        if (found) {
            req.voter = found
            next()
        } else {
            res.status(403).json({
                message: 'Already voted.'
            })
        }
    })
}

const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body
    fs.readFile(usersFilename).then(file => {
        const users = JSON.parse(file)
        const user = users.find(u => { return u.username === username && u.password === password })
        if (user) {
            const accessToken = jwt.sign({ username: user.username }, accessTokenSecret)
            res.json({
                username,
                accessToken
            });
        } else {
            res.status(401).json({
                message: 'Username or password incorrect'
            });
        }
    })
})

app.get('/choices', authenticateJWT, (req, res) => {
    fs.readFile(votesFilename).then(file => {
        const votes = JSON.parse(file)
        const choices = Object.keys(votes)
        res.json(choices)
    })
})

app.get('/allowed', authenticateJWT, (req, res) => {
    const user = req.user
    fs.readFile(usersFilename).then(file => {
        const users = JSON.parse(file)
        const found = users.find(u => { return u.username === user.username && u.voted === false })

        if (found) {
            res.json({
                message: 'Ok'
            })
        } else {
            res.json({
                message: 'Already voted'
            })
        }
    })
})

app.get('/votes', authenticateJWT, (req, res) => {
    fs.readFile(votesFilename).then(file => {
        const votes = JSON.parse(file)
        res.json(votes)
    })
})

app.post('/votes/:option', authenticateJWT, voteOnlyOnce, (req, res) => {
    const option = req.params.option
    fs.readFile(votesFilename).then(votesFile => {
        const votes = JSON.parse(votesFile)

        if (votes[option] === undefined) {
            res.status(403).json({
                message: 'Invalid vote.'
            })
        } else {
            votes[option]++
            req.voter.voted = true
            fs.readFile(usersFilename).then(usersFile => {
                const users = JSON.parse(usersFile)
                const user = users.find(u => { return u.username === req.voter.username })
                user.voted = true
                return users
            })
            .then(users => {
                fs.writeFile(usersFilename, JSON.stringify(users))
            })
            .then(() => {
                fs.writeFile(votesFilename, JSON.stringify(votes))
            })
            .then(() => {
                res.json(votes)
            })
        }
    })
})

app.listen(3000, () => {
    console.log('Authentication service started on port 3000')
})