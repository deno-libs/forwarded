import type { ConnInfo } from 'https://deno.land/std@0.197.0/http/server.ts'

export type RequestWithConnection = Request & { conn: ConnInfo }

/**
 * Get all addresses in the request, using the `X-Forwarded-For` header.
 *
 * @param req Request object
 */
export function forwarded(req: RequestWithConnection) {
  // simple header parsing
  const proxyAddrs = parse(req.headers.get('x-forwarded-for') ?? '')
  const { hostname: socketAddr } = req.conn.remoteAddr as Deno.NetAddr

  // return all addresses
  return [socketAddr].concat(proxyAddrs)
}

/**
 * Parse the `X-Forwarded-For` header.
 *
 * @param header Header value
 */
export function parse(header: string) {
  const list = []
  let start = header.length
  let end = header.length

  // gather addresses, backwards
  for (let i = header.length - 1; i >= 0; i--) {
    switch (header.charCodeAt(i)) {
      case 0x20 /*   */:
        if (start === end) start = end = i

        break
      case 0x2c /* , */:
        if (start !== end) list.push(header.substring(start, end))

        start = end = i

        break
      default:
        start = i

        break
    }
  }

  // final address
  if (start !== end) list.push(header.substring(start, end))

  return list
}
