import type { Business } from "@/types/business"
export const SITE_URL = "https://katrajpune.com"
export const PAGE_SIZE = 48
export function localitySlug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c") }
export function pageNumber(value?: string) { return value && /^[1-9]\d*$/.test(value) ? Number(value) : value ? 0 : 1 }
export function pagePath(path: string, page: number) { return page === 1 ? path : `${path}?page=${page}` }
export function localities(businesses: Business[]) {
 return Array.from(new Set(businesses.map(b => b.locality).filter((v): v is string => !!v))).sort()
}
