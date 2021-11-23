import {EventEmitter} from 'events'
import {Socket, Server, createServer} from 'net'
import {socketId} from './Utils'

interface IResisterConf {
  name: string
  localAddr: string
  localPort: number
}

interface IKv {
  k: string
  v: string | IResisterConf
}

export class ListenServer extends EventEmitter {
  listenServer: Server | undefined
  linkClients: Map<string, Socket>

  constructor() {
    super()
    this.linkClients = new Map()
  }

  onRegister(info: IResisterConf, socket: Socket, linkId: string) {
    console.log(info, socket, linkId)
  }

  onConnect(info: string, socket: Socket, linkId: string) {
    console.log(info, socket, linkId)
  }

  onPing(str: string, socket: Socket, linkId: string) {
    console.log(str, socket, linkId)
  }

  async start(): Promise<number> {
    return new Promise(resolve => {
      this.listenServer = createServer(socket => {
        const id = socketId(socket)
        if (!this.linkClients.get(id)) {
          this.linkClients.set(id, socket)

          socket.on('data', data => {
            try {
              const json = JSON.parse(data.toString()) as IKv
              switch (json.k) {
                case 'r':
                  this.onRegister(json.v as IResisterConf, socket, id)
                  break
                case 'c':
                  this.onConnect(json.v as string, socket, id)
                  break
                case 'p':
                  this.onPing(json.v as string, socket, id)
                  break
              }
            } catch (e) {}
          })

          socket.once('end', () => {
            console.log('end')
          })

          socket.on('error', err => {
            console.log(`err: ${err.message}`)
          })
        }
      })

      this.listenServer.on('error', err => {
        console.log(`主服务错误 ${err.message}`)
      })

      this.listenServer.listen(10010, () => {
        resolve(10010)
      })
    })
  }
}
