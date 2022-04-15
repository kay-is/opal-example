const axios = require("axios")
const bodyParser = require("body-parser")
const express = require("express")
const jwt = require("jsonwebtoken")

const api = express()
api.use(bodyParser.json())

api.post("/login", (request, response) => {
  const { username, password } = request.body
  const token = jwt.sign({ username }, "server_key")
  response.end(JSON.stringify({ token }))
})

const checkPermission = async (input) => {
  const response = await axios.post(
    "http://opal_client:8181/v1/data/app/rbac/allow",
    { input }
  )
  return response.data.result
}

api.get("/finance", async (request, response) => {
  try {
    const token = request.headers.authorization.split(" ").pop()

    const { username } = jwt.verify(token, "server_key")
    const resource = request.route.path.substring(1)

    const isAllowed = await checkPermission({
      user: username,
      action: "read",
      type: resource,
      object: "all",
    })

    if (!isAllowed)
      throw new Error(
        username + " is not allowed to read " + request.route.path
      )
  } catch (e) {
    return response.status(403).end(e.message)
  }

  response.end(
    JSON.stringify({
      finance: [
        { account: 1, balance: 100 },
        { account: 2, balance: 92 },
        { account: 3, balance: -200 },
      ],
    })
  )
})

api.listen(8888, () => console.log("API running on localhost:8888"))
