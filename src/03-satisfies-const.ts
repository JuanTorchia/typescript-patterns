/**
 * PATRÓN 03 — satisfies + as const
 * Validá el tipo sin perder la inferencia de los literales.
 *
 * El problema: cuando anotás un objeto con `: Tipo`, TypeScript amplía los
 * valores a su tipo base y perdés los literales.
 * La solución: satisfies valida la forma del objeto pero preserva los literales.
 */

// ─── ❌ ANTES: la anotación de tipo te hace perder información ───

type Role = "admin" | "editor" | "reader"

interface Permission {
  canPublish: boolean
  canEdit: boolean
  canDelete: boolean
}

// Anotando con `: Record` perdés que 'admin' tiene canPublish=true (lo ve como boolean)
const permissionsBad: Record<Role, Permission> = {
  admin:  { canPublish: true,  canEdit: true,  canDelete: true  },
  editor: { canPublish: false, canEdit: true,  canDelete: false },
  reader: { canPublish: false, canEdit: false, canDelete: false },
}

// TypeScript infiere boolean, no el literal true/false
// permissionsBad.admin.canPublish es `boolean`, no `true`


// ─── ✅ DESPUÉS: satisfies valida sin ampliar los tipos ───

const permissions = {
  admin:  { canPublish: true,  canEdit: true,  canDelete: true  },
  editor: { canPublish: false, canEdit: true,  canDelete: false },
  reader: { canPublish: false, canEdit: false, canDelete: false },
} satisfies Record<Role, Permission>

// Ahora permissions.admin.canPublish es `true`, no `boolean`
// TypeScript te avisa si olvidás un rol o ponés un campo extra


// ─── satisfies + as const: el combo definitivo ───

// as const congela los valores como literales
// satisfies valida que la forma sea correcta
const ROUTES = {
  home:     "/",
  blog:     "/blog",
  admin:    "/admin",
  login:    "/login",
} as const satisfies Record<string, `/${string}`>

// TypeScript sabe que ROUTES.home es "/" (el literal), no string
type AppRoute = typeof ROUTES[keyof typeof ROUTES]
// AppRoute = "/" | "/blog" | "/admin" | "/login"


// ─── Ejemplo real: categorías del blog con colores y slugs ───

interface Category {
  slug: string
  label: string
  color: string
}

const CATEGORIES = {
  javascript: { slug: "javascript", label: "JavaScript",  color: "#f7df1e" },
  typescript: { slug: "typescript", label: "TypeScript",  color: "#3178c6" },
  nextjs:     { slug: "nextjs",     label: "Next.js",     color: "#000000" },
  devops:     { slug: "devops",     label: "DevOps",      color: "#ff6b6b" },
} as const satisfies Record<string, Category>

// Tenés autocomplete de categorías Y los valores literales preservados
type CategoryKey = keyof typeof CATEGORIES
// CategoryKey = "javascript" | "typescript" | "nextjs" | "devops"


// ─── Bonus: detecta campos faltantes en compile time ───

// @ts-expect-error — falta 'color', TypeScript lo detecta
const broken = {
  javascript: { slug: "javascript", label: "JavaScript" },
} satisfies Record<string, Category>


export type { Role, Permission, AppRoute, CategoryKey }
export { permissions, ROUTES, CATEGORIES }
