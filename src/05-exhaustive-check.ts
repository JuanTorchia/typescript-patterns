/**
 * PATRÓN 05 — Exhaustive Check + noUncheckedIndexedAccess
 * Que TypeScript te avise cuando olvidás un caso o accedés a índices que no existen.
 *
 * Dos herramientas del compilador que en conjunto eliminan dos categorías
 * enteras de bugs en runtime.
 */

// ─── PARTE A: Exhaustive Check con never ───

// El problema: agregás un nuevo valor a un union y olvidás actualizar el switch

type NotificationType = "comment" | "like" | "follow" | "mention"  // agregamos "mention"

// ❌ ANTES: si no ponés default, TypeScript no te avisa del caso nuevo
function handleNotificationBad(type: NotificationType): string {
  if (type === "comment") return "Nuevo comentario"
  if (type === "like")    return "Le gustó tu post"
  if (type === "follow")  return "Nuevo seguidor"
  // "mention" no está cubierto, en runtime devuelve undefined (o peor, crashea)
  return "Notificación"
}

// ✅ DESPUÉS: exhaustive check con never
function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Caso no manejado: ${JSON.stringify(value)}`)
}

function handleNotification(type: NotificationType): string {
  switch (type) {
    case "comment": return "Nuevo comentario"
    case "like":    return "Le gustó tu post"
    case "follow":  return "Nuevo seguidor"
    case "mention": return "Te mencionaron"
    default:
      // Si olvidás un caso, TypeScript convierte el default en un error de tipos
      return assertNever(type, `Notificación desconocida: ${type}`)
  }
}

// Ahora si agregás "share" a NotificationType y olvidás el case,
// TypeScript falla en el default: Argument of type '"share"' is not assignable to 'never'


// ─── PARTE B: noUncheckedIndexedAccess ───

// Activalo en tsconfig.json: "noUncheckedIndexedAccess": true
// Efecto: arr[i] pasa a ser T | undefined en lugar de T

const posts = ["post-1", "post-2", "post-3"]

// ❌ ANTES (sin el flag): TypeScript dice que posts[99] es string, te mentía
// const title = posts[99].toUpperCase()  // crash en runtime

// ✅ DESPUÉS (con el flag): TypeScript sabe que puede ser undefined
const maybePost = posts[99]  // string | undefined
if (maybePost !== undefined) {
  console.log(maybePost.toUpperCase())  // seguro
}

// ─── Objeto con index signature: mismo comportamiento ───

const cache: Record<string, { data: unknown; ttl: number }> = {}

// Sin el flag: cache["key"] era { data: unknown; ttl: number }
// Con el flag: cache["key"] es { data: unknown; ttl: number } | undefined
const cached = cache["alguna-key"]
if (cached !== undefined) {
  console.log(cached.ttl)  // TypeScript sabe que existe
}


// ─── Combo real: tipos de sugerencias en la bitácora Dev.to ───

type SuggestionType = "niche_article" | "trending_article" | "person"

interface Suggestion {
  id: string
  type: SuggestionType
  title: string
  url: string
  suggestedComment?: string
}

function renderSuggestion(s: Suggestion): string {
  switch (s.type) {
    case "niche_article":
      return `📝 Artículo de colega: ${s.title}`
    case "trending_article":
      return `🔥 Trending: ${s.title}`
    case "person":
      return `👤 Seguir a ${s.title} en ${s.url}`
    default:
      return assertNever(s.type)
  }
}

// Con noUncheckedIndexedAccess + exhaustive checks, este módulo es imposible
// de romper en runtime por las dos categorías de bugs más comunes.


export type { NotificationType, SuggestionType, Suggestion }
export { assertNever, handleNotification, renderSuggestion }
