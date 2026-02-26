# forwarded

[![GitHub release (latest by date)][releases]][releases-page]
[![GitHub Workflow Status][gh-actions-img]][github-actions]
[![Codecov][codecov-badge]][codecov] [![][docs-badge]][docs]

Deno port of [forwarded](https://github.com/jshttp/forwarded/) library.

## Usage

```ts
import { forwarded } from 'jsr:@deno-libs/forwarded'

Deno.serve((req, info) => new Response(JSON.stringify(forwarded(req, info))))
```

## API

### `forwarded(req, info?)`

Get all addresses in the request, using the `X-Forwarded-For` header.

### `parse(header)`

Parse the X-Forwarded-For header.

[releases]: https://img.shields.io/github/v/release/deno-libs/forwarded?style=flat-square
[docs-badge]: https://img.shields.io/github/v/release/deno-libs/forwarded?color=yellow&label=Documentation&logo=deno&style=flat-square
[docs]: https://doc.deno.land/https/deno.land/x/forwarded/mod.ts
[releases-page]: https://github.com/deno-libs/forwarded/releases
[gh-actions-img]: https://img.shields.io/github/actions/workflow/status/deno-libs/forwarded/main.yml?branch=master&style=flat-square
[codecov]: https://codecov.io/gh/deno-libs/forwarded
[github-actions]: https://github.com/deno-libs/forwarded/actions
[codecov-badge]: https://img.shields.io/codecov/c/gh/deno-libs/forwarded?style=flat-square
