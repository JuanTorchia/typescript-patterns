/**
 * PATRÓN 07 — Result<T, E> (Railway-oriented programming)
 * Error handling sin try/catch, sin excepciones implícitas.
 *
 * El problema: las funciones que pueden fallar no lo dicen en su firma.
 * `async function getUser(id: string): Promise<User>` — ¿qué pasa si falla?
 * Te enterás en runtime cuando explota el try/catch que olvidaste poner.
 *
 * La solución: modelar el éxito y el error como valores explícitos en el tipo
 * de retorno. El compilador te obliga a manejar ambos casos.
 *
 * TypeScript Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAYg9nKBeKBnAhgJwgOwCYBcUAPlAEYDmA3AFCiRQAeYEcAJsAE7EB2wrIiQCWxAKIBbCCAC2oqBHjoA3lBEIAZlCwBXADYBLGFAC+hgqHkB6HVG1QAyjOBQU8xPniIU6ABR4ECAB+bFx8IlIKKigdPA0tXX0jEzMLADM4ZjA0AG1MMAD9AEkoAGMDFBQ0TEwigF1CooJgABUsEABRIkLmQhACYERbYHQUlFaAQgBGAA54AGY
 *
 * Inspirado en Rust's Result<T, E> y fp-ts Either.
 * Esta implementación es minimalista — no requiere ninguna dependencia.
 */

// ─── Tipos base ───

export type Ok<T>  = { readonly ok: true;  readonly value: T }
export type Err<E> = { readonly ok: false; readonly error: E }
export type Result<T, E = Error> = Ok<T> | Err<E>

// ─── Constructores ───

export const ok  = <T>(value: T): Ok<T>   => ({ ok: true,  value })
export const err = <E>(error: E): Err<E>  => ({ ok: false, error })

// ─── Operaciones sobre Result ───

/** Transforma el valor si es Ok, no hace nada si es Err */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result
}

/** Encadena Results — si el primero es Err, lo propaga sin ejecutar fn */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result
}

/** Envuelve una función que puede lanzar en un Result */
export function tryCatch<T>(fn: () => T): Result<T, Error>
export function tryCatch<T, E>(fn: () => T, mapError: (e: unknown) => E): Result<T, E>
export function tryCatch<T, E = Error>(
  fn: () => T,
  mapError?: (e: unknown) => E
): Result<T, E | Error> {
  try {
    return ok(fn())
  } catch (e) {
    return err(mapError ? mapError(e) : (e instanceof Error ? e : new Error(String(e))))
  }
}

/** Versión async de tryCatch */
export async function tryCatchAsync<T, E = Error>(
  fn: () => Promise<T>,
  mapError?: (e: unknown) => E
): Promise<Result<T, E | Error>> {
  try {
    return ok(await fn())
  } catch (e) {
    return err(mapError ? mapError(e) : (e instanceof Error ? e : new Error(String(e))))
  }
}

// ─── ❌ ANTES: el error se pierde en la firma ───

async function getUserBad(id: string): Promise<{ name: string; email: string }> {
  // Si esto falla, ¿quién lo sabe? El llamador asume que siempre funciona
  const res = await fetch(`https://api.example.com/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// El llamador tiene que adivinar que puede fallar:
// const user = await getUserBad("u1")  ← puede explotar, TypeScript no avisa


// ─── ✅ DESPUÉS: el error es parte del contrato ───

type UserError =
  | { code: "NOT_FOUND";   message: string }
  | { code: "NETWORK";     message: string }
  | { code: "PARSE_ERROR"; message: string }

interface UserData { name: string; email: string }

async function getUser(id: string): Promise<Result<UserData, UserError>> {
  const fetchResult = await tryCatchAsync(
    () => fetch(`https://api.example.com/users/${id}`),
    (e) => ({ code: "NETWORK" as const, message: String(e) })
  )

  if (!fetchResult.ok) return fetchResult

  const res = fetchResult.value
  if (res.status === 404) return err({ code: "NOT_FOUND", message: `User ${id} no existe` })
  if (!res.ok)            return err({ code: "NETWORK",   message: `HTTP ${res.status}` })

  return tryCatchAsync(
    () => res.json() as Promise<UserData>,
    ()  => ({ code: "PARSE_ERROR" as const, message: "La respuesta no es JSON válido" })
  )
}

// Ahora el llamador NO PUEDE ignorar el error — TypeScript lo obliga a manejar ambos:
async function demo() {
  const result = await getUser("u1")

  if (!result.ok) {
    // TypeScript sabe que result.error es UserError
    switch (result.error.code) {
      case "NOT_FOUND":   console.log("Usuario no encontrado")    ; break
      case "NETWORK":     console.log("Error de red")             ; break
      case "PARSE_ERROR": console.log("Respuesta malformada")     ; break
    }
    return
  }

  // Acá TypeScript sabe que result.value es UserData
  console.log(`Hola, ${result.value.name}`)
}


// ─── Ejemplo real: pipeline de validación con Result ───

type ValidationError = { field: string; message: string }

function validateEmail(raw: string): Result<string, ValidationError> {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed.includes("@")) {
    return err({ field: "email", message: "Email inválido" })
  }
  return ok(trimmed)
}

function validateName(raw: string): Result<string, ValidationError> {
  const trimmed = raw.trim()
  if (trimmed.length < 2) {
    return err({ field: "name", message: "El nombre es demasiado corto" })
  }
  return ok(trimmed)
}

function validateForm(
  raw: { email: string; name: string }
): Result<{ email: string; name: string }, ValidationError> {
  const emailResult = validateEmail(raw.email)
  if (!emailResult.ok) return emailResult

  const nameResult = validateName(raw.name)
  if (!nameResult.ok) return nameResult

  return ok({ email: emailResult.value, name: nameResult.value })
}

// ─── Demo ───
console.log(validateForm({ email: "juan@juanchi.dev", name: "Juan" }))
// { ok: true, value: { email: "juan@juanchi.dev", name: "Juan" } }

console.log(validateForm({ email: "no-es-un-email", name: "Juan" }))
// { ok: false, error: { field: "email", message: "Email inválido" } }

export { getUser, validateForm }
export type { UserError, UserData, ValidationError }
