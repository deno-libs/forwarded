import type { RequestWithConnection } from './mod.ts'
import { forwarded } from './mod.ts'
import { ConnInfo } from 'https://deno.land/std@0.107.0/http/server.ts'
import { describe, it, expect, run } from 'https://deno.land/x/tincan@0.2.2/mod.ts'

const createReq = (hostname: string, headers?: Record<string, string>): RequestWithConnection =>
  ({
    conn: {
      remoteAddr: {
        hostname,
        port: 8081,
        transport: 'tcp'
      }
    } as ConnInfo,
    headers: new Headers(headers || {})
  } as any)

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
