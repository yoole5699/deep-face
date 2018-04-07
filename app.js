const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const json = require('koa-json')
const cors = require('kcors')
const jwt = require('koa-jwt');
const config = require('./server/config')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
// const { graphqlKoa } = require('apollo-server-koa')
// const myGraphQLSchema = require('./server/graphql')
const routes = require('./server/routes/index')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
// production
// mongoose.connect('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
mongoose.connect(config.mongodb)


const app = new Koa()
// error handler
// onerror(app)

// middlewares
app.use(require('koa-static')(__dirname + '/public'))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  jsonLimit: '10mb'
}))
app.use(cors())
app.use(json())
app.use(logger())

app.use(async(ctx, next) => {
  try{
    await next()
  } catch(e) {
    e.code = e.statusCode || e.status || ctx.status || 500;

    ctx.body = config.getErr(e);
  }
})

app.use(jwt({
      secret: config.jwt_secret
    })
   .unless({
      path:[ /^\/api\/user\/login/, /^\/api\/user\/register/, ]
    }))


// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))


// routes
// routes.post('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
// routes.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));

app.use(routes.routes(), routes.allowedMethods())

module.exports = app
