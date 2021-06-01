'use strict'

import { SquareButton } from '@rackai/symbols'

const Cell = {
  tag: 'td'
}

const MainCell = {
  style: { fontWeight: 'bold' },
  graph: { div: { style: { height: 5 } }}
}

const Row = {
  tag: 'tr',

  childProto: Cell,

  buttons: {
    style: {
      display: 'flex',
      gap: '.2em',
      paddingLeft: '0 !important',
      opacity: '1 !important',
      '&:empty': { padding: '0 !important' }
    },

    childProto: {
      proto: SquareButton,
      if: (el, s) => !s.fromPath || (s[el.key] === el.parent.parent.key),
      style: {
        padding: '.35em',
        fontSize: '15px',
        svg: { opacity: '.15' }
      },
      define: { active: (param, el, state) => state[el.key] === el.parent.parent.key },
      class: {
        active: (el, s) => s[el.key] === el.parent.parent.key ? { svg: { opacity: s.fromPath ? '.5 !important' : '1' }, color: '#087CFA !important' } : {},
      },
      icon: el => el.key,
      theme: 'button',
      attr: {
        title: el => el.key,
        disabled: (el, s) => s.fromPath
      },
      on: {
        click: (ev, el, state) => {
          if (el.active) state.update({ [el.key]: null })
          else state.update({ [el.key]: el.parent.parent.key })
        }
      }
    },

    paddingLeft: {},
    paddingTop: {},
    paddingRight: {},
    paddingBottom: {},
    borderRadius: {}
  },

  i: { style: { opacity: 0.45 } },
  variable: { style: { fontWeight: '300', opacity: 0.35 } },
  decimal: { style: { fontWeight: '300', opacity: 0.35 } },
  graph: { div: { style: { height: 2, background: '#087CFA', width: 0, borderRadius: 2 } }},
}

export default {
  style: {
    color: 'white',
    margin: '6.5vh -1.35em',
    thead: { opacity: '.35' },
    tr: {},
    td: {
      padding: '.65em 1.35em'
    }
  },

  thead: {
    tr: {
      proto: Row,
      i: '#',
      decimal: 'decimal',
      px: 'px',
      em: 'em',
      buttons: null
    }
  },

  on: {
    update: (el, state) => el.set(generateSequence(state.base, state.scale))
  }
}

const numeric = {
  '-6': 'U',
  '-5': 'V',
  '-4': 'W',
  '-3': 'X',
  '-2': 'Y',
  '-1': 'Z',
  '0': 'A',
  '1': 'B',
  '2': 'C',
  '3': 'D',
  '4': 'E',
  '5': 'F',
  '6': 'G',
}

function generateSequence (base, scale) {
  const obj = { tag: 'tbody', childProto: Row }

  for (let i = 6; i >= 0; i--) {
    const value = base / Math.pow(scale, i)
    const em = Math.round(value / base * 1000) / 1000
    const maincell = i === 0
    obj['row' + value] = {
      proto: maincell ? MainCell : {},
      key: numeric[-i],
      i: { text: numeric[-i] },
      decimal: { text: !maincell ? Math.round(value * 100) / 100 : null },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value) } } }
    }
    generateSubSequence(-i, value, obj, base, scale)
  }

  for (let i = 1; i < 7; i++) {
    const value = base * Math.pow(scale, i)
    const em = Math.round(value / base * 1000) / 1000
    obj['row' + value] = {
      key: numeric[i],
      i: { text: numeric[i] },
      decimal: { text: Math.round(value * 100) / 100 },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value) } } }
    }
    generateSubSequence(i, value, obj, base, scale)
  }
  return obj
}

function generateSubSequence (id, val, obj, base, r) {
  const next = val * r
  const smallscale = (next - val) / r
  let arr = []
  if (Math.round(next) - Math.round(val) > 1) arr = [val + smallscale]
  if (Math.round(next) - Math.round(val) > 4) arr = [next - smallscale, val + smallscale]
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    const em = Math.round(value / base * 1000) / 1000
    const key = `${numeric[id]}.${id < 0 ? -i + 2 : i + 1}`
    obj['row' + value] = {
      key,
      style: { td: { opacity: 0.25 } },
      i: { text: key },
      decimal: { text: Math.round(value * 100) / 100 },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value), height: 1 } } }
    }
  }
}
