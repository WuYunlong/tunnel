const {execSync} = require('child_process')

const shell = 'rm -rf node_modules yarn.lock **/**/cjs **/**/esm **/**/yarn.lock **/**/package-lock.json packages/**/node_modules'

execSync(shell)
