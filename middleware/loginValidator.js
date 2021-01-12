const { ErrorModel } = require('../model/resModel')

module.exports = async function loginValidator(ctx, next) {
  if (ctx.session && ctx.session.username) {
    await next()

    return
  }

  ctx.body = new ErrorModel(null, '尚未登录')
}
