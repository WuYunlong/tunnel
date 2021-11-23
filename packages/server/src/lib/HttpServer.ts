import path from 'path'
import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import Static from 'koa-static'
import {ClientManager} from './ClientManager'
import {IncomingMessage, request, ServerResponse} from 'http'

export class HttpServer {
  constructor(public clientManager: ClientManager) {}

  getApiServer(): Koa {
    const app = new Koa()
    const router = new Router()
    router.get('/api/status', ctx => {
      ctx.body = {
        code: '200',
        path: '/api/status'
      }
    })
    app.use(Static(path.join(__dirname, '../../static')))
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(async ctx => {
      ctx.body = `404 Not Found`
      ctx.response.status = 404
    })
    return app
  }

  onTunnel(req: IncomingMessage, res: ServerResponse) {
    const hostname = req.headers.host as string
    const port = this.clientManager.getPort(hostname)
    if (port) {
      const {url, method, headers} = req
      const host = '0.0.0.0'
      const path = url
      delete headers['host']

      const clientReq = request(
        {
          host,
          method,
          path,
          port,
          headers
        },
        (clientRes: IncomingMessage) => {
          if (clientRes.statusCode) {
            res.writeHead(clientRes.statusCode, clientRes.headers)
            clientRes.pipe(res)
            clientRes.on('error', err => {
              console.log(err)
            })
          }
        }
      ).on('error', err => {
        console.log(err)
        res.statusCode = 200
        res.end(`${req.headers['x-forwarded-proto']}://${req.headers.host}`)
      })
      req.pipe(clientReq)
    }

    res.statusCode = 404
    res.end('404')
  }

  onRequest(req: IncomingMessage, res: ServerResponse) {
    const hostname = req.headers.host
    console.log(hostname)
    if (!hostname || hostname === 'ngrok.io') {
      const app = this.getApiServer()
      const appCallback = app.callback()
      return appCallback(req, res)
    }

    return this.onTunnel(req, res)
  }

  async start(): Promise<number> {
    return new Promise(resolve => {
      const server = http.createServer()
      server.on('request', (req, res) => this.onRequest(req, res))
      server.on('error', err => {
        console.log('err', err)
      })
      server.listen(3000, () => resolve(3000))
    })
  }
}
