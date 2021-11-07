'use strict'

import './define'
import './icon'
import style from './style'

import DOM from '@rackai/domql'
import { IconText, Input, Link, Select, SEQUENCE, set, Shape, SquareButton } from '@rackai/symbols'

import preview from './preview'
import table from './table'
import sequence from './sequence'

set('theme', {
  name: 'document',
  color: '#999'
}, {
  name: 'field',
  color: 'white',
  background: '#fff3'
}, {
  name: 'button',
  color: 'white',
  background: '#fff1'
})

const scales = Object.keys(SEQUENCE).map((key) => {
  const value = SEQUENCE[key]
  return { value, text: value, key }
})

const symbolsMap = {
  base: 'b',
  scale: 's',
  borderRadius: 'r',
  paddingLeft: 'L',
  paddingTop: 'T',
  paddingRight: 'R',
  paddingBottom: 'B',
  other: '.'
}

var dom = DOM.create({
  style,
  key: 'app',

  proto: Shape,
  props: {
    theme: 'document',
    round: 0,
  },

  state: {
    lock: false,
    base: 16,
    scale: 1.618
  },

  logo: {
    proto: [Link, IconText],
    props: {
      icon: 'logo',
      href: 'https://symbols.app/',
      target: '_blank'
    },
    style: {
      color: 'white',
      height: 'auto',
      position: 'fixed',
      fontSize: '1.6em',
      padding: '.8em',
      top: 0,
      left: 0
    }
  },

  h2: '(em) Sizing scale',

  fields: {
    style: {
      display: 'flex',
      gap: '1em'
    },
    childProto: {
      props: {
        theme: 'field'
      },
      style: {
        border: '0',
        padding: '.35em .65em'
      }
    },
    base: {
      proto: Input,
      props: {
        placeholder: 'Base',
        type: 'number',
        theme: 'field'
      },
      class: {
        disabled: { '&:disabled': { opacity: 0.7 } }
      },
      attr: {
        value: (el, state) => state.base,
        autofocus: (el, state) => !state.lock,
        disabled: (el,state) => state.lock
      },
      on: {
        input: (ev, el, state) => state.update({ base: el.node.value })
      }
    },
    scale: {
      proto: Select,
      attr: {
        value: (el, state) => state.scale,
        disabled: (el,state) => state.lock
      },

      childProto: {
        define: { value: param => param },
        attr: {
          value: element => element.value,
          selected: (element, state) => element.value == state.scale
        }
      },

      ...scales,

      on: {
        change: (ev, el, state) => state.update({ scale: el.node.value })
      }
    },

    unlock: {
      proto: SquareButton,
      style: {
        color: 'white',
        padding: '.55em',
        fontSize: '15px',
      },
      class: { hide: (el, s) => s.lock ? {} : { display: 'none !important' } },
      props: {
        icon: 'unlock',
      },
      on: {
        click: (ev, el, s) => s.update({ lock: !s.lock })
      }
    }
  },

  t: {
    style: {
      float: 'left',
      maxWidth: 'calc(100% - 320px)',
      position: 'relative',
      zIndex: 99
    },
    table
  },
  preview,

  on: {
    render: (el, state) => {
      const path = window.location.pathname.slice(1)

      if (!path) return el.update({})

      const arr = path.split(',')
      const obj = { lock: true }
      arr.map(v => {
        const k = v.slice(0, 1)
        let key
        var val
        if (k === '.') {
          const param = v.slice(1).split('-')
          key = '.' + unescape(param[0])
          val = unescape(param[1])
        } else {
          key = findByValue(symbolsMap, k)
          val = v.slice(1)
        }
        obj[key] = val
      })
      state.update(obj)
    },
    stateUpdated: (el, s) => {
      const state = s.parse()
      const keys = Object.keys(state)
      const arr = []
      keys.map(v => {
        const k = v.slice(0, 1)
        let key
        if (k === '.') {
          key = v + '-'
        } else {
          key = symbolsMap[v]
        }
        var val = state[v]
        if (key && val) arr.push(key + val)
      })
      window.history.pushState(state, null, '/' + arr.join(','))
    }
  }
})

function findByValue(obj, searchKey) {
  return Object.keys(obj).filter(key => obj[key] === searchKey)[0]
}