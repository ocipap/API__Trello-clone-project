const app = require('./app')
const models = require('./models')
const PORT = process.env.PORT || 3000

models.sequelize.sync({
    force: true
}).then(_ => {
    app.listen(PORT, () => console.log(`Open server on ${PORT}`))
})