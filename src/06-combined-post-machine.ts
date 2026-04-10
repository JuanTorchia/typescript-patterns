/**
 * EJEMPLO COMBINADO — PostStateMachine
 * Los 5 patrones juntos modelando el ciclo de vida de un post en juanchi.dev.
 *
 * Un post pasa por estos estados: draft → scheduled → published → archived
 * Cada transición tiene reglas. TypeScript va a hacer cumplir esas reglas
 * en tiempo de compilación, sin un solo if en runtime.
 */

import type { Brand } from "./02-branded-types.js"
import { assertNever } from "./05-exhaustive-check.js"

// ─── 1. Branded types para los IDs ───

type PostId   = Brand<string, "PostId">
type AuthorId = Brand<string, "AuthorId">
type SlugStr  = Brand<string, "Slug">

function createPostId(raw: string): PostId   { return raw as PostId }
function createAuthorId(raw: string): AuthorId { return raw as AuthorId }
function createSlug(raw: string): SlugStr {
  const slug = raw.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  return slug as SlugStr
}

// ─── 2. Discriminated union para los estados ───

interface BasePost {
  id: PostId
  authorId: AuthorId
  title: string
  content: string
  createdAt: Date
}

type Post =
  | (BasePost & { status: "draft" })
  | (BasePost & { status: "scheduled"; publishAt: Date })
  | (BasePost & { status: "published"; publishedAt: Date; slug: SlugStr; views: number })
  | (BasePost & { status: "archived"; archivedAt: Date; archivedBy: AuthorId; reason: string })

// ─── 3. satisfies para las reglas de transición ───

type Transition = (post: Post) => Post | never

const transitions = {
  schedule: (publishAt: Date): Transition =>
    (post) => {
      if (post.status !== "draft") assertNever(post.status as never, "Solo se puede programar un borrador")
      return { ...post, status: "scheduled", publishAt }
    },

  publish: (slug: string): Transition =>
    (post) => {
      if (post.status !== "draft" && post.status !== "scheduled") {
        throw new Error("Solo se puede publicar desde draft o scheduled")
      }
      return {
        ...post,
        status: "published",
        publishedAt: new Date(),
        slug: createSlug(slug),
        views: 0,
      }
    },

  archive: (archivedBy: AuthorId, reason: string): Transition =>
    (post) => {
      if (post.status !== "published") {
        throw new Error("Solo se pueden archivar posts publicados")
      }
      return { ...post, status: "archived", archivedAt: new Date(), archivedBy, reason }
    },
} satisfies Record<string, (...args: never[]) => Transition>

// ─── 4. infer para extraer tipos de las transiciones ───

type TransitionFn = typeof transitions[keyof typeof transitions]
type TransitionName = keyof typeof transitions
// TransitionName = "schedule" | "publish" | "archive"

// ─── 5. Exhaustive check en el renderer ───

function renderPostStatus(post: Post): string {
  switch (post.status) {
    case "draft":
      return `✏️  Borrador — "${post.title}"`
    case "scheduled":
      return `⏰ Programado para ${post.publishAt.toLocaleDateString("es-AR")} — "${post.title}"`
    case "published":
      return `✅ Publicado en /${post.slug} · ${post.views} visitas`
    case "archived":
      return `📦 Archivado (${post.reason}) — "${post.title}"`
    default:
      return assertNever(post)
  }
}

// ─── Demo: ciclo de vida completo ───

const post: Post = {
  id: createPostId("post_ts-patterns"),
  authorId: createAuthorId("author_juan"),
  title: "5 patrones de TypeScript que eliminan bugs antes de ejecutar el código",
  content: "# Intro\n\nEstos patrones...",
  createdAt: new Date("2026-04-10"),
  status: "draft",
}

console.log(renderPostStatus(post))
// ✏️  Borrador — "5 patrones de TypeScript..."

const published = transitions.publish(post.title)(
  transitions.schedule(new Date("2026-04-12"))(post)
)
console.log(renderPostStatus(published))
// ✅ Publicado en /5-patrones-de-typescript... · 0 visitas


export type { PostId, AuthorId, SlugStr, Post, TransitionName }
export { createPostId, createAuthorId, createSlug, transitions, renderPostStatus }
