import {Tunnel} from './lib/Tunnel'

export class CreateClient {
  tunnel: Tunnel

  constructor() {
    const opt = {
      name: 'ss.ngrok.io',
      localPort: 80,
      localAddr: '127.0.0.1',
      remotePort: 10010,
      remoteAddr: '192.168.10.10'
    }
    this.tunnel = new Tunnel(opt)
  }

  async start() {
    await this.tunnel.open()
  }
}
