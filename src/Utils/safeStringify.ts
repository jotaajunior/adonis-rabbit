import fastSafeStringify from 'fast-safe-stringify'

function replacer(_, value) {
  if (value === '[Circular]') {
    return
  }

  return value
}

export default function safeStringify(value: any) {
  return fastSafeStringify(value, replacer)
}
