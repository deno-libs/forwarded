import { ServerRequest } from 'https://deno.land/std@0.106.0/http/server.ts'
import { forwarded } from './mod.ts'
import { describe, it, expect, run } from 'https://deno.land/x/tincan@0.2.1/mod.ts'

const createReq = (
  hostname: string,
  headers?: Record<string, string>
): Pick<ServerRequest, 'headers'> & { conn: Pick<ServerRequest['conn'], 'remoteAddr'> } => ({
  conn: {
    remoteAddr: {
      hostname,
      port: 8081,
      transport: 'tcp'
    }
  },
  headers: new Headers(headers || {})
})

describe('forwarded(req)', () => {
  it('should work with `X-Forwarded-For` header', () => {
    const req = createReq('127.0.0.1')

    expect(forwarded(req)).toEqual(['127.0.0.1'])
  })
  it('should include entries from `X-Forwarded-For`', () => {
    const req = createReq('127.0.0.1', {
      'x-forwarded-for': '10.0.0.2, 10.0.0.1'
    })

    expect(forwarded(req)).toEqual(['127.0.0.1', '10.0.0.1', '10.0.0.2'])
  })
  it('should skip blank entries', () => {
    const req = createReq('127.0.0.1', {
      'x-forwarded-for': '10.0.0.2,, 10.0.0.1'
    })

    expect(forwarded(req)).toEqual(['127.0.0.1', '10.0.0.1', '10.0.0.2'])
  })
  it('should trim leading OWS', () => {
    const req = createReq('127.0.0.1', {
      'x-forwarded-for': ' 10.0.0.2 ,  , 10.0.0.1 '
    })

    expect(forwarded(req)).toEqual(['127.0.0.1', '10.0.0.1', '10.0.0.2'])
  })
})

run()
