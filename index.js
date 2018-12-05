const app = require('./app')
const models = require('./models')
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>console.log(`Open server on ${PORT}`))