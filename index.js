const Koa = require('koa');
const app = new Koa();
const request = require("request")
const Router = require("koa-router")
const cors = require('koa-cors');

app.use(cors({
    origin(ctx) {
        return ctx.get('Origin') || '*';
    }
})); //放到route前面

let imageUrl = "http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960"

const router = new Router()
router.get("/testPng", async ctx =>{
    ctx.set("Sec-Fetch-Dest","image")
    // sec-fetch-dest:

    ctx.req.headers["Sec-Fetch-Dest"] = "image"
    ctx.status = 200;
    ctx.body = ctx.req.pipe(request(imageUrl).on('response', function(response) {
        // response.header ( 'Access-Control-Allow-Origin' , '*' )
        response.headers["Cache-Control"] = 'public,max-age=60'
        response.headers["Sec-Fetch-Dest"] = "image"
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
    }))
})

app.use(router.routes())

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(9100);
console.log("哈哈哈哈哈")