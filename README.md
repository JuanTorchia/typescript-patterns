# TypeScript Patterns

> 9 patrones del sistema de tipos que hacen que categorías enteras de bugs sean imposibles de escribir.

Companion repo del post **[5 patrones de TypeScript que eliminan bugs antes de ejecutar el código](https://juanchi.dev/blog/5-patrones-typescript-eliminan-bugs-compile-time)** en [juanchi.dev](https://juanchi.dev).

Cada archivo es **standalone**: copialo directo a tu proyecto. Cero dependencias en runtime.

## Ejecutar en 30 segundos

```bash
git clone https://github.com/JuanTorchia/typescript-patterns
cd typescript-patterns
npm install
npm run run       # ve todos los patrones en acción
npm run typecheck # verifica que todo compila
```

## Patrones

| # | Patrón | Playground | Qué elimina |
|---|--------|-----------|-------------|
| 01 | [Discriminated Unions](src/01-discriminated-unions.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAYgNgQ2DAJgYwgHhQPigXigG8oBfKAXigHJkwB7AOwBsBnKAJgC5GAjaAN4BuAFChIsBMjSZc+YmQrA4aVBhy4oAIxQAzKCgBWTHQFcwvAgF8CAegBurAMoCgA) | estados imposibles |
| 02 | [Branded Types](src/02-branded-types.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAggdgSwLYEtkCUEB2BzYBnKAXimBAHICGANlAEbYQgBOIUJFATjAIxTTpsAVxgAzYAF8APACgMmLJwCSeZHjgAzPlAD2AQQBupCAGNVAYzgBeKADJ6AO1XqtUAHSWrAFiu2ASiMwFQBuYO1tXQAaYE0QKHorZkNjKRg4ACYoJ0CQsIjdfRE4gEZkhKSU1MJ02MysqHlqWuSwAHpGqE0AIQBZYGo5OABhAHkAESgbMyhpkrgYGABpKCoFIA) | IDs intercambiados |
| 03 | [satisfies + as const](src/03-satisfies-const.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAqgzhATlAvFA3gKCjqBDAWwC4o0BjYdAbgFgAoGqdAbQF0o4BXAOwHtCANFCRoMmXASKlyVGgwBmxUhSq16jAEzSZctFx4JkKNBiznxk6TJkBiQfwIBzYEIBGiMAEsAJmAC+QgIIiCiOAL7oQA) | perder literales al tipar |
| 04 | [infer en Conditional Types](src/04-infer-conditional.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAaghgGwK4QHLAHYBOBzYBPKAXigG8oBfKAMwEtgBrNASwFsBjYAOnQHsA7gFgAUKEixEKdJhz4iZKjQaIA5gHsIAZQAKzGAFdJYXVAAmEUCggA+KAF5cBImBUQAXCNFgJU2SnpGFjYAdgBGAA4AZlJYYE0rWwcnV3cvH39A4NCIqJj4xKQU9LSKLILColLqCqA) | any al extraer tipos |
| 05 | [Exhaustive Check](src/05-exhaustive-check.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAMgTgSwE4DMICEoF4oG8oBQUUAxgIYC2yA9gHYA2EUA3AFCiRQAeYEcAJsAA+UAM7AA5lFEBXYFAC+UAFxQARsAAmAUyiRgAOzBioAdzTZFABizZ8hFQzYYs2APS2oAIQCyAGUFECBqaFUoAEVcCFdqIA) | casos olvidados en switch |
| 06 | [PostStateMachine (combinado)](src/06-combined-post-machine.ts) | — | todo junto |
| 07 | [Result\<T, E\>](src/07-result-type.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAyg9gOwC4FcBGBnBATAghgDYCWKEATgOZ4BOA3AFCiRQAeYEcAJqTVQHYBjANwBYAFChIsRCkgpUEADyolEZMig9+QkWMlRpAMwVKI6lKmAC-JbgAWNUCIAFe07egA3dVHgAJhBgAJbAkDCBEBo8ZiCWJopmSFbOABZQapq6ekA) | errores explícitos |
| 08 | [Type Predicates](src/08-type-predicates.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/PTAEHkFsBsGMBcCmAbAlgOwOYFdgGd4BnUAd3lEgCN5J4BTAKHnjGzkoHNcaAHQgFYA3KAC8oAOS4A3AChQiVBmy56kAEoCieVABNQAEzkBjPoLWbQqgE5IA9hFABbeMjjxNqfRz0HhqgDCcE5OiujIBsSwsACesJZyNABmAK6EoGCk2SgcpDK2YWFRYfQ5TlxsSADyBCJgAHQkclxU8EqaBiZm7XyCoB2w0i3y0eCFoUWSVdUANN2pOaAAvoxkIVRVAL7KqiB0BOo2XjLevn4s-VAWzO5eAfuH27p6BiZmljZ2ji5uHl4+ASCIXCkWisTiCSS0AApKSaFTwFQmHigA) | type narrowing en runtime |
| 09 | [Mapped Types](src/09-mapped-types.ts) | [▶ Playground](https://www.typescriptlang.org/play?#code/PTAEEMGdIFwVwE4HsCmBLAxgGwM4BQBXAOwFcAbAQwE8AoS0AJXlADNoBnJgc0KIBt4AW3YA7AK5CAtqQA8oAHygAvKABEoAGagARhVAhFoqaCnBkAOy4wArgCMJfQSKkBLJWcGoAJkmA) | transformar tipos |

## Cheat Sheet

```typescript
// ── 01. Discriminated Union ──────────────────────
type State<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error";   error: Error }

// ── 02. Branded Type ─────────────────────────────
type Brand<T, B extends string> = T & { readonly __brand: B }
type UserId = Brand<string, "UserId">
type PostId = Brand<string, "PostId">

// ── 03. satisfies + as const ─────────────────────
const CONFIG = {
  env: "production",
  port: 3000,
} as const satisfies Record<string, string | number>

// ── 04. infer ────────────────────────────────────
type Awaited_<T>   = T extends Promise<infer R> ? R : T
type AsyncReturn<T extends (...a: never[]) => Promise<unknown>> =
  T extends (...a: never[]) => Promise<infer R> ? R : never

// ── 05. Exhaustive Check ─────────────────────────
function assertNever(x: never): never {
  throw new Error(`Caso no manejado: ${JSON.stringify(x)}`)
}
// En el default de tu switch: return assertNever(value)

// ── 07. Result<T, E> ─────────────────────────────
type Ok<T>  = { ok: true;  value: T }
type Err<E> = { ok: false; error: E }
type Result<T, E = Error> = Ok<T> | Err<E>
const ok  = <T>(value: T): Ok<T>  => ({ ok: true,  value })
const err = <E>(error: E): Err<E> => ({ ok: false, error })

// ── 08. Type Predicate ───────────────────────────
function isPost(v: unknown): v is Post {
  return typeof v === "object" && v !== null && "slug" in v
}
function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined
}
// array.filter(isDefined) → quita null/undefined del tipo

// ── 09. Mapped Type ──────────────────────────────
type Nullable<T>   = { [K in keyof T]: T[K] | null }
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T
type AsyncGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => Promise<T[K]>
}
```

## tsconfig recomendado

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "verbatimModuleSyntax": true
  }
}
```

Cada opción más allá de `strict` es una categoría extra de bugs que el compilador detecta. Activarlas en un proyecto existente va a marcar errores — eso es exactamente lo que querés.

## Estructura

```
src/
├── 01-discriminated-unions.ts    # estados imposibles
├── 02-branded-types.ts           # tipos nominales en TypeScript estructural
├── 03-satisfies-const.ts         # validar sin perder literales
├── 04-infer-conditional.ts       # pattern matching sobre tipos
├── 05-exhaustive-check.ts        # switches y arrays seguros
├── 06-combined-post-machine.ts   # todo junto: ciclo de vida de un post
├── 07-result-type.ts             # error handling sin excepciones
├── 08-type-predicates.ts         # type guards que narrowean
├── 09-mapped-types.ts            # transformar la forma de un tipo
└── run.ts                        # runner interactivo
```

## Sobre el autor

**Juan Torchia** — Full Stack Developer · [juanchi.dev](https://juanchi.dev) · [@juantorchia](https://dev.to/juantorchia)
