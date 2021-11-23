import {HttpServer} from './lib/HttpServer'
import {ListenServer} from './lib/ListenServer'
import {ClientManager} from './lib/ClientManager'

export class Tunnel {
  httpServer: HttpServer
  listenServer: ListenServer
  clientManager: ClientManager

  constructor() {
    this.clientManager = new ClientManager()
    this.httpServer = new HttpServer(this.clientManager)
    this.listenServer = new ListenServer()
  }

  async start(): Promise<{httpPort: number; listenPort: number}> {
    return new Promise(async (resolve, reject) => {
      const httpPort = await this.httpServer.start()
      const listenPort = await this.listenServer.start()
      if (httpPort && listenPort) {
        resolve({httpPort, listenPort})
      } else {
        reject(new Error())
      }
    })
  }
}
