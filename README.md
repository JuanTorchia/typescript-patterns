# TypeScript Patterns — Companion Repo

> Código real del post **[5 patrones de TypeScript que eliminan bugs antes de ejecutar el código](https://juanchi.dev/blog/5-patrones-typescript-eliminan-bugs-compile-time)** publicado en [juanchi.dev](https://juanchi.dev)

Cada archivo es un patrón standalone que podés copiar y adaptar. El tsconfig está configurado con las opciones más estrictas de 2026 para que veas exactamente cómo TypeScript detecta los errores.

## Patrones

| # | Archivo | Patrón | Bug que elimina |
|---|---------|--------|-----------------|
| 01 | `src/01-discriminated-unions.ts` | Discriminated Unions | Estados imposibles en runtime |
| 02 | `src/02-branded-types.ts` | Branded Types | IDs intercambiados por accidente |
| 03 | `src/03-satisfies-const.ts` | `satisfies` + `as const` | Perder literales al anotar tipos |
| 04 | `src/04-infer-conditional.ts` | `infer` en Conditional Types | `any` para extraer tipos de genéricos |
| 05 | `src/05-exhaustive-check.ts` | Exhaustive Check + `noUncheckedIndexedAccess` | Casos no manejados y crashes por índices |
| 06 | `src/06-combined-post-machine.ts` | Ejemplo combinado | — todos juntos — |

## Uso

```bash
npm install
npm run typecheck   # verifica todos los patrones
```

## tsconfig destacado

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noPropertyAccessFromIndexSignature": true
}
```

Estas opciones van más allá de `strict: true` y son las que hacen que los patrones 03 y 05 tengan sentido.

## Sobre el autor

**Juan Torchia** — Full Stack Developer, marca [Nativo Digital](https://juanchi.dev)

- Blog: [juanchi.dev](https://juanchi.dev)
- Dev.to: [@juantorchia](https://dev.to/juantorchia)
- GitHub: [@JuanTorchia](https://github.com/JuanTorchia)
