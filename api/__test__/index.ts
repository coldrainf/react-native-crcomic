import Koa from 'koa'
import API from '..'
import Router from 'koa-router'

const app = new Koa()
const api = API as any
const router = new Router()

Object.keys(api).map(name => {
    let controller = api[name]
    Object.keys(controller).map(c => {
        if (typeof controller[c] != 'function') return
        router.get(`/${name}/${c}`, async ctx => {
            try {
                let data = await controller[c](ctx.query)
                ctx.body = { code: 0, data }
            } catch (err) {
                console.log(err)
                ctx.body = { code: 1 }
            }
        })
    })
})

app.use(router.routes())

const port = 4396
app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
})

export default app