# forwarded

[![GitHub release (latest by date)][releases]][releases-page] [![GitHub Workflow Status][gh-actions-img]][github-actions]
[![Codecov][codecov-badge]][codecov] [![][docs-badge]][docs]

Deno port of [forwarded](https://github.com/jshttp/forwarded/) library.

## Usage

```ts
import { serve } from 'https://deno.land/std@0.88.0/http/server.ts'
import { forwarded, parse } from 'https://deno.land/x/forwarded@v0.0.1/mod.ts'

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
[docs-badge]: https://img.shields.io/github/v/release/deno-libs/forwarded?color=yellow&label=Documentation&logo=deno&style=flat-square
[docs]: https://doc.deno.land/https/deno.land/x/forwarded/mod.ts
[releases-page]: https://github.com/deno-libs/forwarded/releases
[gh-actions-img]: https://img.shields.io/github/workflow/status/deno-libs/wizard/CI?style=flat-square
[codecov]: https://codecov.io/gh/deno-libs/wizard
[github-actions]: https://github.com/deno-libs/wizard/actions
[codecov-badge]: https://img.shields.io/codecov/c/gh/deno-libs/wizard?style=flat-square
