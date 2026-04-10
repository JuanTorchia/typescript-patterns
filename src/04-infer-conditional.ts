/**
 * PATRÓN 04 — infer en Conditional Types
 * Extraé tipos de genéricos sin recurrir al any.
 *
 * El problema: cuando trabajás con genéricos complejos, muchas veces terminás
 * usando `any` o castings para extraer el tipo "de adentro" de un wrapper.
 * La solución: `infer` te deja capturar un tipo mientras hacés pattern matching
 * sobre la estructura de otro tipo.
 */

// ─── Cómo funciona infer ───

// T extends Promise<infer R>: "si T es una Promise de algo, capturá ese algo en R"
type Awaited_<T> = T extends Promise<infer R> ? R : T

type A = Awaited_<Promise<string>>   // string
type B = Awaited_<Promise<number[]>> // number[]
type C = Awaited_<string>            // string (no es Promise, devuelve T)


// ─── ❌ ANTES: extraer tipos con any y castings ───

async function fetchUserBad(id: string) {
  const res = await fetch(`/api/users/${id}`)
  const data = await res.json()
  return data as any  // 🤮 perdemos todo el tipado
}

// Y después en el componente:
// const user = await fetchUserBad("u1")
// user.name  ← any, sin autocomplete, sin checks


// ─── ✅ DESPUÉS: utility types con infer para tipar Server Actions ───

// Extraer el tipo de retorno de una función async
type AsyncReturn<T extends (...args: never[]) => Promise<unknown>> =
  T extends (...args: never[]) => Promise<infer R> ? R : never

// Extraer el tipo de los elementos de un array
type ElementType<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never

// Extraer el primer argumento de una función
type FirstArg<T extends (first: never, ...rest: never[]) => unknown> =
  T extends (first: infer F, ...rest: never[]) => unknown ? F : never

// Desempaquetar un tipo nullable
type NonNullable_<T> = T extends null | undefined ? never : T


// ─── Ejemplo real: tipar automáticamente las Server Actions del blog ───

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
}

interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
}

async function getPosts(page: number): Promise<PaginatedResult<Post>> {
  // En el blog real esto va a Prisma, acá simulamos
  return { items: [], total: 0, page }
}

// Extraemos el tipo de retorno automáticamente — si cambia getPosts, cambia esto solo
type GetPostsResult = AsyncReturn<typeof getPosts>
// GetPostsResult = PaginatedResult<Post>

type PostItem = ElementType<GetPostsResult["items"]>
// PostItem = Post


// ─── Template literal types + infer: el combo pesado ───

// Extraer el parámetro de una ruta dinámica
type RouteParam<T extends string> =
  T extends `${string}:${infer Param}/${string}` ? Param :
  T extends `${string}:${infer Param}` ? Param :
  never

type BlogParam   = RouteParam<"/blog/:slug">        // "slug"
type UserParam   = RouteParam<"/users/:id/posts">   // "id"
type NoParam     = RouteParam<"/about">             // never

// Event handler types type-safe
type EventMap = {
  "post:published": { postId: string; slug: string }
  "post:deleted":   { postId: string }
  "user:login":     { userId: string; timestamp: Date }
}

type EventPayload<K extends keyof EventMap> = EventMap[K]

function emit<K extends keyof EventMap>(event: K, payload: EventPayload<K>): void {
  console.log(event, payload)
}

emit("post:published", { postId: "p1", slug: "mi-post" }) // ✅
// @ts-expect-error
emit("post:published", { postId: "p1" })  // ❌ falta slug


export type { Awaited_, AsyncReturn, ElementType, FirstArg, RouteParam, EventMap }
export { getPosts, emit }
