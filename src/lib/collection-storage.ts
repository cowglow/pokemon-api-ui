import {CollectionItem} from "../redux/reducers/collection.ts";

const COLLECTION_KEY = "pokemon-collection"

export function getStoredCollection(): CollectionItem[] {
    try {
        const raw = window.localStorage.getItem(COLLECTION_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function setStoredCollection(items: CollectionItem[]) {
    try {
        window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(items))
    } catch (error) {
        console.warn("Failed to persist collection to localStorage", error)
    }
}
