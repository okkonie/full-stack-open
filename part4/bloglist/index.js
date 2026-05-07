const app = require('./app')
const config = require('./utils/config')
const logger = require('./controller/logger')

const PORT = config.PORT

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})