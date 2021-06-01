'use strict'

import { Icon } from '@rackai/symbols'
import { deepMerge } from '@rackai/domql/src/utils'

import * as sprite from './svg'

deepMerge(Icon.sprite, sprite)
