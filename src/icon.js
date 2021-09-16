'use strict'

import { Icon } from '@rackai/symbols'
import * as sprite from './svg'

Icon.src = ({ key, props, name }) => sprite[name || props.icon || key] || sprite

export { sprite }
export { Icon }
