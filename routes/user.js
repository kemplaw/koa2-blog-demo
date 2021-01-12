const router = require('koa-router')()
const { login, signIn } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  const result = (await login(username, password)) || {}

  if (result.username) {
    ctx.session.username = username
    ctx.session.realname = result.realname

    ctx.body = new SuccessModel(result, '登录成功')

    return
  }

  ctx.body = new ErrorModel(null, '用户名或密码错误')
})

router.post('/signIn', async ctx => {
  const { body } = ctx.request
  const { username, password } = body || {}

  if (!username || !password) return (ctx.body = new ErrorModel(null, '注册失败'))

  const result = await signIn(body)

  ctx.body = result.username
    ? new SuccessModel(result, '注册成功')
    : new ErrorModel(null, '注册失败')
})

router.post('/logout', async ctx => {
  console.log(1)
  ctx.session.username = ''
  ctx.session.realname = ''

  ctx.body = new SuccessModel(null, '退出登录成功')
})

module.exports = router
