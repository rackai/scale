'use strict'

import { SquareButton } from '@rackai/symbols'

import sequence from './sequence'

const Cell = {
  tag: 'td'
}

const MainCell = {
  style: { fontWeight: 'bold' },
  graph: { div: { style: { height: 5 } } }
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
      if: (el, s) => !s.lock || (s[el.key] === el.parent.parent.key),
      style: {
        padding: '.35em',
        fontSize: '15px',
        svg: { opacity: '.15' }
      },
      define: { active: (param, el, state) => state[el.key] === el.parent.parent.key },
      class: {
        active: (el, s) => {
          const active = s[el.key] === el.parent.parent.key
          const activeStyle = {
            svg: { opacity: s.lock ? '.5 !important' : '1' }, color: '#087CFA !important'
          }
          return active ? activeStyle : {}
        }
      },
      icon: el => el.key,
      theme: 'button',
      attr: {
        title: el => el.key,
        disabled: (el, s) => s.lock
      },
      on: {
        click: (ev, el, state) => {
          if (el.active) delete state[el.key] && state.update()
          else state.update({ [el.key]: el.parent.parent.key })
        }
      }
    },

    paddingLeft: {},
    paddingTop: {},
    paddingRight: {},
    paddingBottom: {},
    borderRadius: {},
    other: {
      if: (el, s) => !s.lock || (findByValueAndKeyMathes(s.parse(), el.parent.parent.key)),
      define: { what: param => param },
      class: {
        active: (el, s) => {
          const active = el.what
          const activeStyle = {
            svg: { opacity: s.lock ? '.5 !important' : '1' }, color: '#087CFA !important'
          }
          return active ? activeStyle : {}
        }
      },
      what: (el, s) => {
        const st = s.parse()
        const anythingFound = findByValueAndKeyMathes(st, el.parent.parent.key)
        return anythingFound && anythingFound.slice(1)
      },
      attr: {
        title: (el, s) => el.what
      },
      on: {
        click: (ev, el, state) => {
          const prompt = window.prompt()
          if (!prompt) return
          el.what = prompt
          state.update({ ['.' + prompt]: el.parent.parent.key })
        }
      }
    }
  },

  i: { style: { opacity: 0.45 } },
  variable: { style: { fontWeight: '300', opacity: 0.35 } },
  decimal: { style: { fontWeight: '300', opacity: 0.35 } },
  graph: { div: { style: { height: 2, background: '#087CFA', width: 0, borderRadius: 2 } } }
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
    update: (el, state) => {
      el.set(generateSequence(state.base, state.scale))
      el.lookup('app').preview.update()
    }
  }
}

const numeric = {
  '-6': 'U',
  '-5': 'V',
  '-4': 'W',
  '-3': 'X',
  '-2': 'Y',
  '-1': 'Z',
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G'
}

function generateSequence (base, scale) {
  const obj = { tag: 'tbody', childProto: Row }
  sequence.s = {}

  for (let i = 6; i >= 0; i--) {
    const value = base / Math.pow(scale, i)
    const em = Math.round(value / base * 1000) / 1000
    const maincell = i === 0
    obj[numeric[-i]] = {
      proto: maincell ? MainCell : {},
      key: numeric[-i],
      i: { text: numeric[-i] },
      decimal: { text: !maincell ? Math.round(value * 100) / 100 : null },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value) } } }
    }
    sequence.s[numeric[-i]] = em
    generateSubSequence(-i, value, obj, base, scale)
  }

  for (let i = 1; i < 7; i++) {
    const value = base * Math.pow(scale, i)
    const em = Math.round(value / base * 1000) / 1000
    obj[numeric[i]] = {
      key: numeric[i],
      i: { text: numeric[i] },
      decimal: { text: Math.round(value * 100) / 100 },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value) } } }
    }
    sequence.s[numeric[i]] = em
    generateSubSequence(i, value, obj, base, scale)
  }
  return obj
}

function generateSubSequence (id, val, obj, base, r) {
  const next = val * r
  const smallscale = (next - val) / r
  let arr = []
  if (Math.round(next) - Math.round(val) > 1) arr = [val + smallscale]
  if (Math.round(next) - Math.round(val) > 2) arr = [next - smallscale, val + smallscale]
  if (Math.round(next) - Math.round(val) > 100) arr = [next - smallscale, (next + val) / 2, val + smallscale]
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    const em = Math.round(value / base * 1000) / 1000
    const key = `${numeric[id]}${i + 1}`
    obj[key] = {
      key,
      style: { td: { opacity: 0.25 } },
      i: { text: key },
      decimal: { text: Math.round(value * 100) / 100 },
      value: Math.round(value),
      em: em + 'em',
      buttons: {},
      graph: { div: { style: { width: Math.round(value), height: 1 } } }
    }
    sequence.s[key] = em
  }
}

function findByValueAndKeyMathes (obj, searchKey) {
  return Object.keys(obj).filter(key => (obj[key] === searchKey) && key.slice(0, 1) === '.')[0]
}
