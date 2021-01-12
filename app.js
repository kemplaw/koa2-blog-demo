const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-morgan')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./conf/db')
const createWriteStream = require('./utils/log')
const ENV = process.env.NODE_ENV

// const index = require('./routes/index')
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
if (ENV === 'development') {
  app.use(logger('dev'))
} else {
  app.use(
    logger('combined', {
      stream: createWriteStream()
    })
  )
}
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 配置 session
app.keys = ['Kemp_9441_#']
app.use(
  session({
    cookie: {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 3600 * 1000
    },
    store: redisStore(REDIS_CONF)
  })
)

// routes
// app.use(index.routes(), index.allowedMethods())
app.use(blogRouter.routes(), blogRouter.allowedMethods())
app.use(userRouter.routes(), userRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
