import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {Pokemon} from "../../types/pokemon.ts";
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
        },
        removeFromCollection: collectionAdapter.removeOne
    }
})

const collectionSelectors = collectionAdapter.getSelectors<RootState>((state) => state.collection)

export function getCollection(state: RootState) {
    return collectionSelectors.selectAll(state)
}

const selectCollectionIdsByName = createSelector(
    (state: RootState) => collectionSelectors.selectAll(state),
    (items) => new Map(items.map(({id, pokemon}) => [pokemon.name, id]))
)

export function isInCollection(state: RootState, name: string) {
    return selectCollectionIdsByName(state).has(name)
}

export function getCollectionItemId(state: RootState, name: string) {
    return selectCollectionIdsByName(state).get(name)
}

const selectCollectedNames = createSelector(
    selectCollectionIdsByName,
    (idsByName) => new Set(idsByName.keys())
)

export function getCollectedNames(state: RootState) {
    return selectCollectedNames(state)
}

export function useCollection() {
    return useSelector(getCollection)
}

export function useIsInCollection(name: string) {
    return useSelector((state: RootState) => isInCollection(state, name))
}

export function useCollectionItemId(name: string) {
    return useSelector((state: RootState) => getCollectionItemId(state, name))
}

export function useCollectedNames() {
    return useSelector(getCollectedNames)
}

export const {addToCollection, hydrateCollection, removeFromCollection} = collectionSlice.actions
export default collectionSlice.reducer
