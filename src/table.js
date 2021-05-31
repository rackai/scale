'use strict'

const Cell = {
  tag: 'td'
}

const Row = {
  tag: 'tr',

  childProto: Cell
}

export default {
  style: {
    color: 'white',
    margin: '6.5vh 0',
    thead: { opacity: '.35' },
    tr: {},
    td: {
      padding: '.35em'
    }
  },

  thead: {
    tr: {
      childProto: { tag: 'td' },
      id: '#',
      px: 'px',
      em: 'em'
    }
  },

  tbody: {
    childProto: Row,

    on: {
      update: (el, state) => el.set(generateSequence(state.base, state.ratio))
    }
  },
}

function generateSequence (base, ratio) {
  const obj = {}
  for (let i = 1; i < 6; i++) {
    const em = Math.pow(ratio, 1/i)
    const value = base * Math.pow(ratio, i)
    obj[value] = {
      id: i,
      value,
      em
    }
  }
  return obj
}

function generateSubSequence (base, ratio) {

}
