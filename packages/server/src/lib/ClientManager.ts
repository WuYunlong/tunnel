export interface IInfo {
  port: number
  bytes: number
  [props: string]: any
}

export class ClientManager {
  clients: Map<string, IInfo>
  constructor() {
    this.clients = new Map()
  }

  get(key: string) {
    return this.clients.get(key)
  }

  set(key: string, info: IInfo) {
    return this.clients.set(key, info)
  }

  has(key: string) {
    return this.clients.has(key)
  }

  delete(key: string) {
    if (this.has(key)) {
      this.clients.delete(key)
    }
  }

  clear() {
    this.clients = new Map()
  }

  setPort(key: string, port: number) {
    if (this.has(key)) {
      const info = this.get(key) as IInfo
      info.port = port
      return this.set(key, info)
    }
    return false
  }

  getPort(key: string): number | false {
    if (this.has(key)) {
      const info = this.get(key) as IInfo
      return info.port || false
    }
    return false
  }
}
