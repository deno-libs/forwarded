export type ConnectionInfo = Pick<Deno.ServeHandlerInfo, 'remoteAddr'>

export type RequestWithConnection = Request & {
  conn?: Pick<Deno.Conn, 'remoteAddr'>
  connInfo?: ConnectionInfo
}

function getAddress(addr: Deno.Addr): string {
  if ('hostname' in addr) return addr.hostname
  if ('path' in addr) return addr.path

  return String(addr.cid)
}

/**
 * Get all addresses in the request, using the `X-Forwarded-For` header.
 *
 * @param req Request object
 * @param info Deno 2 request connection info (optional)
 */
export function forwarded(
  req: RequestWithConnection,
  info?: ConnectionInfo,
): string[] {
  // simple header parsing
  const proxyAddrs = parse(req.headers.get('x-forwarded-for') ?? '')
  const remoteAddr = info?.remoteAddr ?? req.connInfo?.remoteAddr ??
    req.conn?.remoteAddr

  if (!remoteAddr) {
    throw new TypeError(
      'Unable to determine remote address. Pass Deno.serve `info` as second argument.',
    )
  }

  const socketAddr = getAddress(remoteAddr)

  // return all addresses
  return [socketAddr].concat(proxyAddrs)
}

/**
 * Parse the `X-Forwarded-For` header.
 *
 * @param header Header value
 */
export function parse(header: string): string[] {
  const list: string[] = []
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
