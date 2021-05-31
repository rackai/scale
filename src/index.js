'use strict'

import './define'
import style from './style'

import DOM from '@rackai/domql'
import { Input, Select, Sequence, set, Shape } from '@rackai/symbols'

import table from './table'

set('theme', {
  name: 'document',
  color: '#999'
}, {
  name: 'field',
  color: 'white',
  background: '#fff3'
})

var dom = DOM.create({
  style,

  proto: Shape,
  theme: 'document',
  round: 0,

  state: {
    base: 17,
    ratio: 1.618,
    sequence: []
  },

  h2: 'Sizing scale',

  fields: {
    style: {
      display: 'flex',
      gap: '1em'
    },
    childProto: {
      theme: 'field',
      style: {
        border: '0',
        padding: '.35em .65em'
      }
    },
    base: {
      proto: Input,
      placeholder: 'Base',
      type: 'number',
      attr: {
        value: (el, state) => state.base
      },
      on: {
        change: (ev, el, state) => state.update({ base: el.node.value })
      }
    },
    ratio: {
      proto: Select,
      attr: {
        value: (el, state) => state.ratio
      },

      ...Sequence,

      on: {
        change: (ev, el, state) => state.update({ ratio: el.node.value })
      }
    }
  },

  on: {
    render: (el, state) => el.update({})
  },

  table
})