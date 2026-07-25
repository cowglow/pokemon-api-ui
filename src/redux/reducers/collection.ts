import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {Pokemon} from "../../lib/PokemonType.ts";
import {RootState} from "../store-config.ts";

export type CollectionState = {
    items: Record<string, Pokemon>
}

const initialState: CollectionState = {
    items: {}
}

const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {
        addToCollection: (state, action: PayloadAction<Pokemon>) => ({
            ...state,
            items: {...state.items, [action.payload.name]: action.payload}
        }),
        hydrateCollection: (state, action: PayloadAction<Pokemon[]>) => ({
            ...state,
            items: Object.fromEntries(action.payload.map((pokemon) => [pokemon.name, pokemon]))
        })
    }
})

export function getCollection(state: RootState) {
    return Object.values(state.collection.items)
}

export function isInCollection(state: RootState, name: string) {
    return name in state.collection.items
}

export function useCollection() {
    return useSelector(getCollection)
}

export function useIsInCollection(name: string) {
    return useSelector((state: RootState) => isInCollection(state, name))
}

export const {addToCollection, hydrateCollection} = collectionSlice.actions
export default collectionSlice.reducer
