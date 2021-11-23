import {createConnection, Socket} from 'net'

interface ITunnelOpt {
  name: string
  localPort: number
  localAddr: string
  remotePort: number
  remoteAddr: string
}

interface IObj {
  [props: string]: any
}

export class Tunnel {
  pingTimer: NodeJS.Timeout | null
  pingTime: number
  checkTimer: NodeJS.Timeout | null
  checkTime: number
  remotePort: number
  remoteAddr: string
  linkClient: Socket | undefined
  connectTimer: NodeJS.Timeout | null
  opt: ITunnelOpt

  constructor(opt: ITunnelOpt) {
    this.pingTimer = null
    this.checkTimer = null
    this.connectTimer = null
    this.pingTime = 10
    this.checkTime = 10
    this.remotePort = 0
    this.remoteAddr = ''
    this.opt = opt
    console.log(this.opt)
  }

  /**
   * 检测链接存活性
   */
  checkLink() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer)
      this.checkTimer = null
    }
  }

  /**
   * 服务器链接成功
   */
  onConnection() {
    const {name, localPort, localAddr} = this.opt
    this.linkSend({
      k: 'r',
      v: {
        name,
        localPort,
        localAddr
      }
    })
    this.checkLink()
  }

  /**
   * 重新链接服务器
   */
  reConnect() {
    if (this.connectTimer) {
      clearTimeout(this.connectTimer)
      this.connectTimer = null
    }
    this.connectTimer = setTimeout(async () => {
      console.log(`正在重新链接服务器`)
      await this.open()
    })
  }

  /**
   * 接受数据
   * @param data
   */
  onData(data: Buffer) {
    console.log(data)
  }

  /**
   * 发生数据
   * @param info
   */
  linkSend(info: IObj) {
    this.linkClient?.write(JSON.stringify(info))
  }

  async open(): Promise<boolean> {
    return new Promise(resolve => {
      const {remotePort, remoteAddr} = this.opt
      this.linkClient = createConnection(remotePort, remoteAddr, () => this.onConnection)
      this.linkClient.on('error', () => this.reConnect())
      this.linkClient.on('data', chunk => this.onData(chunk))
      resolve(true)
    })
  }
}
