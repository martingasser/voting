# Voting API server

The API is written in node.js with the express.js library. 

API clients can login and receive a JSON web token that can be used to access the other services.

The endpoints are:

`POST /login`

Username and password have to be sent in the request body. If the credentials are found in the local user database (`db/users.json`), a JSON web token is returned to the client.

`GET /choices`

Returns a list of valid choices for the poll.

`GET /allowed`

Checks whether the current user has already voted.

`GET /votes`

Returns the current poll result.

`POST /votes/:option`

Submits a new vote for `:option`. If `:option` is an invalid choice or if the current user has already voted, an error is returned.
