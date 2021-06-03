'use strict'

import sequence from './sequence'

export default {
  style: (el, state) => ({
    position: 'sticky',
    top: 0,
    right: 0,
    float: 'right',
    fontSize: 13,
    width: 320,
    boxSizing: 'border-box',
    display: Object.keys(state.parse()).length > 3 ? 'block' : 'none',
    marginTop: '6.5vh'
  }),

  childProto: {
    style: {
      background: '#fff1',
      padding: '1.35em',
      marginBottom: '.2em',
      width: '100%'
    },
    header: {
      style: { opacity: '.5', fontWeight: 500, marginBottom: '.65em' },
    }
  },

  boxModel: {
    header: { text: 'Preview' },

    grid: {
      style: {
        display: 'grid',
        gridTemplateAreas: `
          "x1 t x2"
          "l content r"
          "x3 b x4"
        `,
        gridTemplateColumns: '30px auto 30px',
        gridTemplateRows: '30px auto 30px',
        alignItems: 'center',
        textAlign: 'center',
        div: {
          padding: '.35em',
          opacity: '.35'
        }
      },
      ...[
        ...['', { text: (el, s) => s.paddingTop || '', style: { gridArea: 't' } }, ''],
        ...[{ text: (el, s) => s.paddingLeft || '', style: { gridArea: 'l' } }, {
          style: (el, s) => ({
            gridArea: 'content',
            borderStyle: 'solid',
            borderColor: '#C5D08A33',
            background: '#fff1',
            fontSize: `${s.base}px`,
            lineHeight: 1,
            opacity: '1 !important',
            borderRadius: (sequence.s[s['borderRadius']] || 0) + 'em',
            borderTopWidth: (sequence.s[s['paddingTop']] || 0) + 'em',
            borderLeftWidth: (sequence.s[s['paddingLeft']] || 0) + 'em',
            borderBottomWidth: (sequence.s[s['paddingBottom']] || 0) + 'em',
            borderRightWidth: (sequence.s[s['paddingRight']] || 0) + 'em',
          }),
          text: (el, s) => `Base ${s.base}`
        }, { text: (el, s) => s.paddingRight || '', style: { gridArea: 'r' } }],
        ...['', { text: (el, s) => s.paddingBottom || '', style: { gridArea: 'b' } }, '']
      ]
    }
  },

  codeR: {
    style: {
      pre: {
        lineHeight: 1.4,
        color: '#fff9',
        padding: '.65em 1em',
        display: 'block',
        margin: '.35em -.35em 0',
        borderRadius: '.35em',
        background: '#ffffff05'
      }
    },
    header: { text: 'Code' },
    pre: (el, state) => {
      const { base, paddingLeft, paddingTop, paddingRight, paddingBottom, borderRadius, ...other } = state.parse()

      var matrix = []
      if (paddingTop && paddingTop === paddingBottom && paddingTop === paddingLeft && paddingLeft === paddingRight) matrix.push(['padding', paddingTop])
      else {
        if (paddingTop && paddingTop === paddingBottom) matrix.push(['paddingVertical', paddingTop])
        else {
          if (paddingTop) matrix.push(['paddingTop', paddingTop])
          if (paddingBottom) matrix.push(['paddingBottom', paddingBottom])
        }
        if (paddingLeft && paddingLeft === paddingRight) matrix.push(['paddingHorizontal', paddingLeft])
        else {
          if (paddingLeft) matrix.push(['paddingLeft', paddingLeft])
          if (paddingRight) matrix.push(['paddingRight', paddingRight])
        }
      }
      if (borderRadius) matrix.push(['borderRadius', borderRadius])

      Object.keys(other).map(v => {
        if (v.slice(0,1) === '.') matrix.push([v.slice(1), other[v]])
      })

return `container: {
  fontSize: '${parseInt(base / 17 * 1000) / 1000}em',
  ${matrix.map(v => (v[1] = `size.${v[1]}`) && (v.join(': '))).join(',\n  ')}
}`
    }
  }
}
