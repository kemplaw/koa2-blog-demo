const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginValidator = require('../middleware/loginValidator')

router.prefix('/api/blog')

router.get('/list', async ctx => {
  const { author = '', keyword = '' } = ctx.query

  try {
    const listData = await getList(author, keyword)

    ctx.body = new SuccessModel(listData)
  } catch (error) {
    ctx.body = new ErrorModel(null, error)
  }
})

router.get('/detail', async ctx => {
  try {
    const data = await getDetail(ctx.query.id)

    ctx.body = new SuccessModel(data)
  } catch (error) {
    ctx.body = new ErrorModel(null, error)
  }
})

router.post('/new', loginValidator, async ctx => {
  ctx.request.body.author = ctx.session.username

  try {
    const data = await newBlog(ctx.request.body)

    ctx.body = new SuccessModel(data, '创建成功')
  } catch (error) {
    ctx.body = new ErrorModel(null, error)
  }
})

router.post('/update', loginValidator, async ctx => {
  try {
    await updateBlog({
      ...ctx.request.body,
      username: ctx.session.username
    })

    ctx.body = new SuccessModel(null, '更新成功')
  } catch (error) {
    ctx.body = new ErrorModel(null, error)
  }
})

router.post('/del', loginValidator, async ctx => {
  ctx.request.body.author = ctx.session.username

  const { id, author } = ctx.request.body || {}

  try {
    await delBlog(id, author)

    ctx.body = new SuccessModel(null, '删除成功')
  } catch (error) {
    ctx.body = new ErrorModel(null, error)
  }
})

module.exports = router
