/**
 * PATRÓN 08 — Type Predicates & Assertion Functions
 * Enseñale a TypeScript a narrowear tus tipos en runtime.
 *
 * El problema: TypeScript no puede saber qué forma tiene un valor que viene
 * de afuera del sistema (API, localStorage, JSON.parse). Los type guards
 * te dan una forma de enseñárselo, con validación real en runtime.
 *
 * TypeScript Playground: https://www.typescriptlang.org/play?#code/PTAEHkFsBsGMBcCmAbAlgOwOYFdgGd4BnUAd3lEgCN5J4BTAKHnjGzkoHNcaAHQgFYA3KAC8oAOS4A3AChQiVBmy56kAEoCieVABNQAEzkBjPoLWbQqgE5IA9hFABbeMjjxNqfRz0HhqgDCcE5OiujIBsSwsACesJZyNABmAK6EoGCk2SgcpDK2YWFRYfQ5TlxsSADyBCJgAHQkclxU8EqaBiZm7XyCoB2w0i3y0eCFoUWSVdUANN2pOaAAvoxkIVRVAL7KqiB0BOo2XjLevn4s-VAWzO5eAfuH27p6BiZmljZ2ji5uHl4+ASCIXCkWisTiCSS0AApKSaFTwFQmHigA
 */

// ─── Type Predicate básico: value is T ───

// ❌ ANTES: typeof/instanceof manual, TypeScript no narrowea después
function processValueBad(value: unknown) {
  if (typeof value === "string") {
    value.toUpperCase() // ok — TypeScript sí narrowea typeof
  }
  // Pero para objetos complejos, necesitás algo más
}

// ✅ DESPUÉS: type predicate — la función "le enseña" a TypeScript qué es el valor
function isString(value: unknown): value is string {
  return typeof value === "string"
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value)
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}


// ─── Type guards para objetos complejos ───

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt?: Date
}

interface Comment {
  id: string
  postId: string
  content: string
  authorName: string
}

// Sin type guard, TypeScript no sabe si un objeto es Post o Comment
function isPost(value: unknown): value is Post {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "slug" in value &&
    typeof (value as Post).id === "string" &&
    typeof (value as Post).title === "string" &&
    typeof (value as Post).slug === "string"
  )
}

function isComment(value: unknown): value is Comment {
  return (
    typeof value === "object" &&
    value !== null &&
    "postId" in value &&
    "content" in value &&
    "authorName" in value
  )
}

// Ahora TypeScript sabe qué es cada cosa después del guard:
export function processContent(raw: unknown): string {
  if (isPost(raw))    return `Post: ${raw.title} (/${raw.slug})`
  if (isComment(raw)) return `Comentario de ${raw.authorName}: ${raw.content}`
  return "Contenido desconocido"
}


// ─── Assertion functions (TypeScript 3.7+) ───
// En lugar de retornar boolean, lanzan si la condición falla

function assertDefined<T>(value: T | null | undefined, name?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name ?? "Value"} no puede ser null/undefined`)
  }
}

function assertIsPost(value: unknown): asserts value is Post {
  if (!isPost(value)) {
    throw new Error(`Valor inválido para Post: ${JSON.stringify(value)}`)
  }
}

// Uso: después de la assertion, TypeScript sabe el tipo sin el if
async function publishPost(rawData: unknown) {
  assertIsPost(rawData)
  // A partir de acá, TypeScript sabe que rawData es Post
  console.log(`Publicando: ${rawData.title}`)
  // rawData.title ← autocomplete, tipado, sin el !
}


// ─── Patrón avanzado: Array filter con type predicate ───

// ❌ ANTES: filter devuelve (Post | null)[] aunque filtraste los null
const rawPosts: (Post | null | undefined)[] = [
  { id: "1", title: "Post 1", slug: "post-1", published: true },
  null,
  { id: "2", title: "Post 2", slug: "post-2", published: false },
  undefined,
]

const postsWithNull = rawPosts.filter(Boolean)
// postsWithNull es (Post | null | undefined)[] — TypeScript no removió los null!

// ✅ DESPUÉS: filter con type predicate elimina null/undefined del tipo
const cleanPosts = rawPosts.filter(isDefined)
// cleanPosts es Post[] — TypeScript sabe que no hay null ni undefined

cleanPosts.forEach(post => {
  console.log(post.title) // ← sin ! ni castings
})


// ─── Patrón real: validar respuestas de API ───

interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T; error: null } {
  return response.data !== null && response.error === null && response.status >= 200 && response.status < 300
}

function handleApiResponse<T>(response: ApiResponse<T>): T | never {
  if (isSuccessResponse(response)) {
    // TypeScript sabe que response.data es T (no T | null)
    return response.data
  }
  throw new Error(response.error ?? `HTTP ${response.status}`)
}

// ─── Demo ───
const response: ApiResponse<Post> = {
  data: { id: "1", title: "TypeScript Patterns", slug: "ts-patterns", published: true },
  error: null,
  status: 200,
}

const post = handleApiResponse(response)
console.log(post.title) // TypeScript sabe que es Post, no Post | null

export {
  isString, isNumber, isDefined, isPost, isComment,
  assertDefined, assertIsPost,
  isSuccessResponse, handleApiResponse,
}
export type { Post, Comment, ApiResponse }
