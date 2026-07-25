import {Pokemon} from "./PokemonType.ts";

const COLLECTION_KEY = "pokemon-collection"

export function getStoredCollection(): Pokemon[] {
    try {
        const raw = window.localStorage.getItem(COLLECTION_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function setStoredCollection(items: Pokemon[]) {
    window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(items))
}
