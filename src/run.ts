/**
 * Runner interactivo — ve todos los patrones en acción.
 * Uso: npx tsx src/run.ts
 */

import { ok, err, mapResult, tryCatch, validateForm } from "./07-result-type.js"
import {
  isPost, isComment, isDefined,
  processContent, handleApiResponse,
} from "./08-type-predicates.js"
import { POST_STATUS } from "./09-mapped-types.js"
import { renderPostStatus, transitions, createPostId, createAuthorId } from "./06-combined-post-machine.js"

const RESET  = "\x1b[0m"
const BOLD   = "\x1b[1m"
const CYAN   = "\x1b[36m"
const GREEN  = "\x1b[32m"
const YELLOW = "\x1b[33m"
const RED    = "\x1b[31m"
const DIM    = "\x1b[2m"

function header(n: string, title: string) {
  console.log(`\n${BOLD}${CYAN}── Patrón ${n}: ${title} ──${RESET}`)
}
function ok_(label: string, value: unknown) {
  console.log(`  ${GREEN}✅${RESET} ${label}:`, value)
}
function err_(label: string, value: unknown) {
  console.log(`  ${RED}❌${RESET} ${label}:`, value)
}
function note(msg: string) {
  console.log(`  ${DIM}${msg}${RESET}`)
}

console.log(`\n${BOLD}TypeScript Patterns — Demo Runner${RESET}`)
console.log(`${DIM}https://github.com/JuanTorchia/typescript-patterns${RESET}\n`)

// ── 01: Discriminated Unions ─────────────────────────────────────────────────
header("01", "Discriminated Unions")
import("./01-discriminated-unions.js").then(({ renderFetch, describePost }) => {
  ok_("idle",      renderFetch({ status: "idle" }))
  ok_("loading",   renderFetch({ status: "loading" }))
  ok_("success",   renderFetch({ status: "success", data: { id: "u1", name: "Juan" } }))
  ok_("error",     renderFetch({ status: "error", error: new Error("timeout") }))
  ok_("draft",     describePost({ status: "draft" }))
  ok_("published", describePost({ status: "published", publishedAt: new Date(), slug: "mi-post" }))
})

// ── 02: Branded Types ────────────────────────────────────────────────────────
header("02", "Branded Types")
import("./02-branded-types.js").then(({ createUserId, createPostId, getPost }) => {
  const uid = createUserId("user_123")
  const pid = createPostId("post_456")
  ok_("getPost(uid, pid)", getPost(uid, pid))
  note("getPost(pid, uid) ← TypeScript Error: Argument of type 'PostId' is not assignable to 'UserId'")

  try {
    createUserId("invalid_id")
  } catch (e) {
    err_("createUserId('invalid_id')", (e as Error).message)
  }
})

// ── 03: satisfies + as const ─────────────────────────────────────────────────
header("03", "satisfies + as const")
import("./03-satisfies-const.js").then(({ permissions, ROUTES, CATEGORIES }) => {
  ok_("permissions.admin.canPublish", permissions.admin.canPublish)
  ok_("ROUTES.blog",                 ROUTES.blog)
  ok_("CATEGORIES.typescript.color", CATEGORIES.typescript.color)
  note("Todos los valores son literales (true, '/blog', '#3178c6') — no boolean/string")
})

// ── 04: infer en Conditional Types ──────────────────────────────────────────
header("04", "infer en Conditional Types")
import("./04-infer-conditional.js").then(({ emit }) => {
  ok_("emit post:published", "{ postId: 'p1', slug: 'mi-post' }")
  note("emit('post:published', { postId: 'p1' }) ← TypeScript Error: falta 'slug'")
})

// ── 05: Exhaustive Check + noUncheckedIndexedAccess ─────────────────────────
header("05", "Exhaustive Check + noUncheckedIndexedAccess")
import("./05-exhaustive-check.js").then(({ handleNotification, renderSuggestion, assertNever }) => {
  ok_("comment",  handleNotification("comment"))
  ok_("mention",  handleNotification("mention"))
  ok_("article",  renderSuggestion({ id: "s1", type: "niche_article", title: "TypeScript para todos", url: "https://dev.to/..." }))
  ok_("person",   renderSuggestion({ id: "s2", type: "person", title: "Juan Torchia", url: "https://dev.to/juantorchia" }))
  note("Si agregás un tipo nuevo al union, el default falla en compilación")
})

// ── 06: PostStateMachine (combinado) ─────────────────────────────────────────
header("06", "PostStateMachine — todos los patrones combinados")
import("./06-combined-post-machine.js").then(({ renderPostStatus, transitions, createPostId, createAuthorId, createSlug }) => {
  const base = {
    id: createPostId("post_ts-patterns"),
    authorId: createAuthorId("author_juan"),
    title: "TypeScript Patterns",
    content: "...",
    createdAt: new Date(),
  }
  const draft     = { ...base, status: "draft" as const }
  const published = transitions.publish("TypeScript Patterns")(draft) as Extract<typeof draft, { status: "published" }>

  ok_("draft",     renderPostStatus(draft))
  ok_("published", renderPostStatus(published))
})

// ── 07: Result<T, E> ────────────────────────────────────────────────────────
header("07", "Result<T, E> — error handling sin excepciones")
const r1 = ok({ name: "Juan", email: "juan@juanchi.dev" })
const r2 = err({ field: "email", message: "Email inválido" })
const r3 = mapResult(r1, u => u.name.toUpperCase())
const r4 = tryCatch(() => JSON.parse('{"valid": true}'))
const r5 = tryCatch(() => JSON.parse("{ invalid json }"))

ok_("ok({ name })",             r1)
err_("err({ field, message })", r2)
ok_("mapResult → uppercase",    r3)
ok_("tryCatch(JSON valid)",      r4)
err_("tryCatch(JSON invalid)",   r5.ok ? null : r5.error.message)

const formOk  = validateForm({ email: "juan@juanchi.dev", name: "Juan" })
const formErr = validateForm({ email: "no-email",         name: "J"    })
ok_("validateForm OK",  formOk)
err_("validateForm Err", formErr.ok ? null : formErr.error)

// ── 08: Type Predicates ──────────────────────────────────────────────────────
header("08", "Type Predicates — type guards que narrowean")
const rawPost    = { id: "1", title: "Post", slug: "post", published: true }
const rawComment = { id: "2", postId: "1", content: "Hola", authorName: "Juan" }
const rawUnknown = { foo: "bar" }

ok_("isPost(rawPost)",       isPost(rawPost)    + " → " + processContent(rawPost))
ok_("isComment(rawComment)", isComment(rawComment) + " → " + processContent(rawComment))
ok_("isDefined(null)",       isDefined(null))
ok_("isDefined('value')",    isDefined("value"))

const items: (typeof rawPost | null | undefined)[] = [rawPost, null, undefined, { id: "2", title: "Post 2", slug: "post-2", published: false }]
const filtered = items.filter(isDefined)
ok_("filter(isDefined) removes null/undefined", `${items.length} items → ${filtered.length} posts`)

// ── 09: Mapped Types ─────────────────────────────────────────────────────────
header("09", "Mapped Types — transformar la forma de un tipo")
console.log("  POST_STATUS:")
Object.entries(POST_STATUS).forEach(([key, val]) => {
  console.log(`    ${val.icon}  ${YELLOW}${key}${RESET}: label="${val.label}", color="${val.color}"`)
})
note("satisfies verifica que estén todos los estados y campos — sin perder los literales")

console.log(`\n${GREEN}${BOLD}✅ Todos los patrones ejecutados correctamente${RESET}\n`)
