import type { RequestWithConnection } from './mod.ts'
import { forwarded } from './mod.ts'

const createReq = (
  headers?: Record<string, string>,
): RequestWithConnection => ({
  headers: new Headers(headers || {}),
} as unknown as RequestWithConnection)

const createRemoteAddrInfo = (hostname: string) => ({
  remoteAddr: {
    hostname,
    port: 8081,
    transport: 'tcp',
  } as Deno.NetAddr,
})

const assertArrayEquals = (actual: string[], expected: string[]) => {
  if (
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    throw new Error(
      `Assertion failed.\nExpected: ${JSON.stringify(expected)}\nActual: ${
        JSON.stringify(actual)
      }`,
    )
  }
}

Deno.test('forwarded(req): should use Deno 2 info.remoteAddr', () => {
  const req = createReq()
  const info = createRemoteAddrInfo('127.0.0.1')

  assertArrayEquals(forwarded(req, info), ['127.0.0.1'])
})

Deno.test('forwarded(req): should include entries from `X-Forwarded-For`', () => {
  const req = createReq({
    'x-forwarded-for': '10.0.0.2, 10.0.0.1',
  })
  const info = createRemoteAddrInfo('127.0.0.1')

  assertArrayEquals(forwarded(req, info), ['127.0.0.1', '10.0.0.1', '10.0.0.2'])
})

Deno.test('forwarded(req): should skip blank entries', () => {
  const req = createReq({
    'x-forwarded-for': '10.0.0.2,, 10.0.0.1',
  })
  const info = createRemoteAddrInfo('127.0.0.1')

  assertArrayEquals(forwarded(req, info), ['127.0.0.1', '10.0.0.1', '10.0.0.2'])
})

Deno.test('forwarded(req): should trim leading OWS', () => {
  const req = createReq({
    'x-forwarded-for': ' 10.0.0.2 ,  , 10.0.0.1 ',
  })
  const info = createRemoteAddrInfo('127.0.0.1')

  assertArrayEquals(forwarded(req, info), ['127.0.0.1', '10.0.0.1', '10.0.0.2'])
})

Deno.test('forwarded(req): should support legacy req.conn.remoteAddr', () => {
  const req = createReq()
  req.conn = createRemoteAddrInfo('127.0.0.1')

  assertArrayEquals(forwarded(req), ['127.0.0.1'])
})
