#!/usr/bin/env node

import {CreateClient} from './index'

new CreateClient().start().then(res => console.log(res))
