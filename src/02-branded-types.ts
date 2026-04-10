/**
 * PATRÓN 02 — Branded Types (Tipos nominales en TypeScript estructural)
 * Evitá pasar el ID equivocado al lugar equivocado.
 *
 * El problema: TypeScript es estructural — dos tipos con la misma forma son
 * intercambiables, aunque semánticamente sean distintos.
 * La solución: "brandear" el tipo con una propiedad fantasma que solo existe
 * en el sistema de tipos (no en runtime).
 */

// ─── ❌ ANTES: todos los IDs son strings intercambiables ───

function getPostBad(userId: string, postId: string): string {
  return `Buscando post ${postId} del user ${userId}`
}

// TypeScript no dice nada, pero los args están al revés:
const userId = "user_123"
const postId = "post_456"
getPostBad(postId, userId)  // ← bug silencioso en producción


// ─── ✅ DESPUÉS: branded types que TypeScript rechaza al revés ───

// El truco: una intersección con un objeto fantasma que nunca existe en runtime
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId  = Brand<string, "UserId">
type PostId  = Brand<string, "PostId">
type CommentId = Brand<string, "CommentId">

// Smart constructor: la única forma de crear un UserId válido
function createUserId(raw: string): UserId {
  if (!raw.startsWith("user_")) {
    throw new Error(`ID inválido para User: ${raw}`)
  }
  return raw as UserId
}

function createPostId(raw: string): PostId {
  if (!raw.startsWith("post_")) {
    throw new Error(`ID inválido para Post: ${raw}`)
  }
  return raw as PostId
}

function getPost(userId: UserId, postId: PostId): string {
  return `Buscando post ${postId} del user ${userId}`
}

const uid = createUserId("user_123")
const pid = createPostId("post_456")

getPost(uid, pid)  // ✅ correcto

// @ts-expect-error — TypeScript rechaza esto en compilación, no en runtime
getPost(pid, uid)  // ❌ Error: Argument of type 'PostId' is not assignable to parameter of type 'UserId'


// ─── Ejemplo real: branded types para montos y monedas ───

type USD = Brand<number, "USD">
type ARS = Brand<number, "ARS">

function formatUSD(amount: USD): string {
  return `$${amount.toFixed(2)}`
}

const precioEnDolares = 29.99 as USD
const precioEnPesos   = 28500 as ARS

formatUSD(precioEnDolares)  // ✅
// @ts-expect-error
formatUSD(precioEnPesos)    // ❌ — no mezclás monedas por accidente


export type { Brand, UserId, PostId, CommentId, USD, ARS }
export { createUserId, createPostId, getPost, formatUSD }
