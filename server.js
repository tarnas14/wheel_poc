const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 3000

const app = express()

const CLIENT_BUILD_PATH = path.resolve(__dirname, './dist')
app.use('/', express.static(CLIENT_BUILD_PATH))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './dist', 'index.html')))

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

