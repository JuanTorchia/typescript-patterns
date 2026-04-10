/**
 * PATRÓN 01 — Discriminated Unions
 * Elimina los estados imposibles antes de que lleguen a producción.
 *
 * El problema: boolean flags que pueden coexistir de formas que no tienen sentido.
 * La solución: un campo discriminante que hace que TypeScript sepa exactamente
 * en qué estado estás en cada rama del código.
 */

// ─── ❌ ANTES: tres flags booleanos que crean 8 combinaciones (la mayoría inválidas) ───

interface FetchStateBad {
  isLoading: boolean
  data: User | null
  error: Error | null
}

// Nada impide que esto exista en tu app:
const estado_imposible: FetchStateBad = {
  isLoading: true,   // está cargando...
  data: { id: "u1", name: "Juan" },  // ...pero también tiene data...
  error: new Error("timeout"),       // ...y también un error. ¿Qué mostrás?
}

// ─── ✅ DESPUÉS: discriminated union — solo 3 combinaciones, todas válidas ───

interface User {
  id: string
  name: string
}

type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error }

// Ahora TypeScript sabe exactamente qué tenés disponible en cada rama:
function renderFetch(state: FetchState<User>): string {
  switch (state.status) {
    case "idle":
      return "Esperando..."
    case "loading":
      return "Cargando..."
    case "success":
      // TypeScript sabe que state.data existe acá — no necesitás el !
      return `Hola, ${state.data.name}`
    case "error":
      // TypeScript sabe que state.error existe acá
      return `Error: ${state.error.message}`
  }
}

// ─── Ejemplo real: estados de publicación de un post ───

type PostStatus =
  | { status: "draft" }
  | { status: "scheduled"; publishAt: Date }
  | { status: "published"; publishedAt: Date; slug: string }
  | { status: "archived"; archivedAt: Date; reason: string }

function describePost(post: PostStatus): string {
  switch (post.status) {
    case "draft":
      return "Borrador — no visible"
    case "scheduled":
      return `Programado para ${post.publishAt.toLocaleDateString("es-AR")}`
    case "published":
      return `Publicado en /${post.slug}`
    case "archived":
      return `Archivado: ${post.reason}`
  }
}

export type { FetchState, PostStatus }
export { renderFetch, describePost }
