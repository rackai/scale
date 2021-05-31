'use strict'

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

  i: { style: { opacity: 0.35 } },
  decimal: { style: { fontWeight: '300', opacity: 0.35 } },
  graph: { div: { style: { height: 2, background: '#087CFA', width: 0, borderRadius: 2 } }}
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
      px: 'px',
      em: 'em',
      decimal: 'decimal'
    }
  },

  on: {
    update: (el, state) => el.set(generateSequence(state.base, state.ratio))
  }
}

function generateSequence (base, ratio) {
  const obj = { tag: 'tbody', childProto: Row }

  for (let i = 6; i >= 0; i--) {
    const value = base / Math.pow(ratio, i)
    const em = Math.round(value / base * 1000) / 1000
    const maincell = i === 0
    obj['row' + value] = {
      proto: maincell ? MainCell : {},
      i: { text: !maincell ? -i : null },
      value: Math.round(value),
      em,
      decimal: { text: !maincell ? Math.round(value * 100) / 100 : null },
      graph: { div: { style: { width: Math.round(value) } } }
    }
    generateSubSequence(-i, value, obj, base, ratio)
  }

  for (let i = 1; i < 7; i++) {
    const value = base * Math.pow(ratio, i)
    const em = Math.round(value / base * 1000) / 1000
    obj['row' + value] = {
      i: { text: i },
      value: Math.round(value),
      em,
      decimal: { text: Math.round(value * 100) / 100 },
      graph: { div: { style: { width: Math.round(value) } } }
    }
    generateSubSequence(i, value, obj, base, ratio)
  }
  return obj
}

function generateSubSequence (id, val, obj, base, r) {
  const next = val * r
  const smallRatio = (next - val) / r
  let arr = []
  if (Math.round(next) - Math.round(val) > 1) arr = [val + smallRatio]
  if (Math.round(next) - Math.round(val) > 4) arr = [next - smallRatio, val + smallRatio]
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    const em = Math.round(value / base * 1000) / 1000
    obj['row' + value] = {
      style: { opacity: 0.35 },
      i: { text: `${id < 0 ? '-' : ''}${id < 0 ? -(id + 1) : id}.${id < 0 ? -i + 2 : i + 1}` },
      value: Math.round(value),
      em,
      decimal: { text: Math.round(value * 100) / 100 },
      graph: { div: { style: { width: Math.round(value), height: 1 } } }
    }
  }
}
