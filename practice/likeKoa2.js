const http = require('http')

// 组合中间件
function compose(middlewareList = []) {
  return function (ctx) {
    function dispatch(i) {
      const fn = middlewareList[i]

      try {
        // 此处使用 resolve 再次包裹是避免传入的 中间件不是异步的
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn)

    return this
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    ctx.query = req.query

    return ctx
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList) // return function(ctx)

    return (req, res) => {
      const ctx = this.createContext(req, res) // ctx

      // 返回 function(ctx) 的调用结果
      // function(ctx) => dispatch(i) 
      // 调用结果 => Promise<middlewareFn(ctx, nextMiddleWareFn)>
      return this.handleRequest(ctx, fn)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())

    server.listen(...args)
  }
}

const app = new LikeKoa2()

app.use(async (ctx, next) => {
  console.log('m1')

  await next()
})

app.use((ctx, next) => {
  console.log('m2')
})

app.listen(9000)
