import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {Pokemon} from "../../lib/PokemonType.ts";
import {RootState} from "../store-config.ts";

export type CollectionItem = {
    id: string
    pokemon: Pokemon
}

const collectionAdapter = createEntityAdapter<CollectionItem>()

const collectionSlice = createSlice({
    name: "collection",
    initialState: collectionAdapter.getInitialState(),
    reducers: {
        addToCollection: {
            reducer: collectionAdapter.addOne,
            prepare: (pokemon: Pokemon) => ({
                payload: {id: crypto.randomUUID(), pokemon}
            })
        },
        hydrateCollection: (state, action: PayloadAction<CollectionItem[]>) => {
            collectionAdapter.setAll(state, action.payload)
        }
    }
})

const collectionSelectors = collectionAdapter.getSelectors<RootState>((state) => state.collection)

export function getCollection(state: RootState) {
    return collectionSelectors.selectAll(state)
}

const selectCollectedNames = createSelector(
    (state: RootState) => collectionSelectors.selectAll(state),
    (items) => new Set(items.map(({pokemon}) => pokemon.name))
)

export function isInCollection(state: RootState, name: string) {
    return selectCollectedNames(state).has(name)
}

export function useCollection() {
    return useSelector(getCollection)
}

export function useIsInCollection(name: string) {
    return useSelector((state: RootState) => isInCollection(state, name))
}

export const {addToCollection, hydrateCollection} = collectionSlice.actions
export default collectionSlice.reducer
