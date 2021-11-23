import {Socket} from 'net'
import {createHash} from 'crypto'

export const md5 = (str: string): string => {
  return createHash('md5').update(str).digest('hex').toString()
}

export const socketId = (socket: Socket): string => {
  const id = [socket.remoteAddress, socket.remoteFamily, socket.remotePort].join('-')
  return md5(id)
}
