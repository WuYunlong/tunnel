#!/usr/bin/env node

import {Tunnel} from './index'

const tunnel = new Tunnel()

tunnel.start().then(res => {
  console.log(res)
})
