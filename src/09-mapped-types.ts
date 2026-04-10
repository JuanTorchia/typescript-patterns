/**
 * PATRÓN 09 — Mapped Types & Key Remapping
 * Transformá la forma de un tipo sin repetirte.
 *
 * El problema: cuando tenés que crear variantes de un tipo (readonly, partial,
 * nullable, con prefijo en los keys), terminás copiando y pegando interfaces.
 * Los mapped types te dejan describir la transformación una sola vez.
 *
 * TypeScript Playground: https://www.typescriptlang.org/play?#code/PTAEEMGdIFwVwE4HsCmBLAxgGwM4BQBXAOwFcAbAQwE8AoS0AJXlADNoBnJgc0KIBt4AW3YA7AK5CAtqQA8oAHygAvKABEoAGagARhVAhFoqaCnBkAOy4wArgCMJfQSKkBLJWcGoAJkmA
 *
 * Los utility types built-in de TypeScript (Partial, Required, Readonly, Pick,
 * Omit, Record) son todos mapped types. Acá aprendés a hacer los tuyos.
 */

// ─── Mapped type básico: recorrer las keys de un tipo ───

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "reader"
  createdAt: Date
}

// { [K in keyof T]: ... } — "para cada key de T, hacé algo con el tipo"

// Nullable version de cualquier tipo
type Nullable<T> = { [K in keyof T]: T[K] | null }
type NullableUser = Nullable<User>
// { id: string | null; name: string | null; email: string | null; ... }

// Async getters para cada propiedad
type AsyncGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => Promise<T[K]>
}
type UserGetters = AsyncGetters<User>
// { getId: () => Promise<string>; getName: () => Promise<string>; ... }


// ─── Key remapping con as ───

// Crear un tipo de eventos a partir de un modelo
type ChangeEvents<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (prev: T[K], next: T[K]) => void
}
type UserEvents = ChangeEvents<User>
// { onIdChange: (prev: string, next: string) => void; onNameChange: ... }


// ─── Filtrar keys con never ───

// Quedarse solo con las keys que son string
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type UserStringKeys = StringKeys<User>  // "id" | "name" | "email"

// Quedarse solo con los campos opcionales
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T]

// Hacer readonly solo algunas keys
type ReadonlyKeys<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>

type UserWithReadonlyId = ReadonlyKeys<User, "id" | "createdAt">
// id y createdAt son readonly, el resto mutable


// ─── Ejemplo real: generar tipos para formularios ───

// Dado un modelo, generar el tipo del formulario (todo string + errores)
type FormFields<T> = {
  [K in keyof T]: {
    value: string       // los inputs siempre son string
    error: string | null
    touched: boolean
  }
}

type UserForm = FormFields<Pick<User, "name" | "email">>
// {
//   name:  { value: string; error: string | null; touched: boolean }
//   email: { value: string; error: string | null; touched: boolean }
// }


// ─── Patrón avanzado: DeepReadonly y DeepPartial ───

type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

interface Config {
  database: {
    host: string
    port: number
    credentials: {
      user: string
      password: string
    }
  }
  features: {
    newsletter: boolean
    devto: boolean
  }
}

// Config inmutable en todos los niveles anidados
type FrozenConfig = DeepReadonly<Config>

// Para overrides parciales (merge de configuración)
type ConfigOverride = DeepPartial<Config>

const override: ConfigOverride = {
  database: {
    port: 5433  // solo cambiás lo que necesitás
  }
}


// ─── Mapped types + satisfies: el combo para diccionarios tipados ───

type StatusConfig = {
  label: string
  color: string
  icon: string
}

type PostStatusMap = {
  [K in "draft" | "scheduled" | "published" | "archived"]: StatusConfig
}

const POST_STATUS = {
  draft:     { label: "Borrador",   color: "#9ca3af", icon: "✏️"  },
  scheduled: { label: "Programado", color: "#fbbf24", icon: "⏰"  },
  published: { label: "Publicado",  color: "#00ff88", icon: "✅"  },
  archived:  { label: "Archivado",  color: "#8b5cf6", icon: "📦"  },
} satisfies PostStatusMap

// TypeScript verifica que estén todos los estados y todos los campos
// Los valores preservan sus literales gracias a satisfies

type PostStatusKey = keyof typeof POST_STATUS
// "draft" | "scheduled" | "published" | "archived"

export type {
  Nullable, AsyncGetters, ChangeEvents, StringKeys,
  FormFields, DeepReadonly, DeepPartial,
  PostStatusMap, PostStatusKey,
}
export { POST_STATUS }
