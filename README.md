# forwarded

![GitHub release (latest by date)][releases] ![https://doc.deno.land/https/deno.land/x/forwarded@v0.8.0/mod.ts][docs]

Deno port of [forwarded](https://github.com/jshttp/forwarded/) library.

## Usage

```ts
import { serve } from 'https://deno.land/std@0.88.0/http/server.ts'
import { forwarded, parse } from 'https://deno.land/x/deno-libs/forwarded/mod.ts'

const s = await serve({ port: 3000 })

for await (const req of s) {
  console.log(forwarded(s))
}
```

## API

### `forwarded(req)`

Get all addresses in the request, using the `X-Forwarded-For` header.

### `parse(header)`

Parse the X-Forwarded-For header.

[license]: https://github.com/deno-libs/forwarded/blob/master/LICENSE
[releases]: https://img.shields.io/github/v/release/deno-libs/forwarded?style=flat-square
[docs]: https://img.shields.io/github/v/release/deno-libs/forwarded?color=yellow&label=Documentation&logo=deno&style=flat-square
