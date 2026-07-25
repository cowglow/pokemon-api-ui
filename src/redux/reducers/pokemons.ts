import {Pokemon} from "../../types/pokemon.ts";
import {Pokemon as PokemonDetail} from "../../lib/PokemonType.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {RootState} from "../store-config.ts";

export type PokemonState = {
    items: Pokemon[],
    loading: boolean,
    error: unknown,
    selectedPokemon: Pokemon | null,
    details: Record<string, PokemonDetail>
    detailsLoading: Record<string, boolean>
    detailsError: Record<string, unknown>
}
const initialState: PokemonState = {
    items: [],
    loading: false,
    error: null,
    selectedPokemon: null,
    details: {},
    detailsLoading: {},
    detailsError: {},
}

const pokemonSlice = createSlice({
    name: "pokemons",
    initialState,
    reducers: {
        fetchPokemonsStart: (state, _action: PayloadAction<number>) => ({
            ...state,
            loading: true,
        }),
        fetchPokemonsSuccess: (state, action) => ({
            ...state,
            loading: false,
            items: action.payload
        }),
        fetchPokemonsFailure: (state, action) => ({
            ...state,
            loading: false,
            error: action.payload
        }),
        setSelectedPokemon: (state, action) => ({
            ...state,
            selectedPokemon: action.payload
        }),
        fetchPokemonDetailStart: (state, action: PayloadAction<{ name: string, url: string }>) => ({
            ...state,
            detailsLoading: {...state.detailsLoading, [action.payload.name]: true},
            detailsError: {...state.detailsError, [action.payload.name]: null}
        }),
        fetchPokemonDetailSuccess: (state, action: PayloadAction<PokemonDetail>) => ({
            ...state,
            details: {
                ...state.details,
                [action.payload.name]: action.payload
            },
            detailsLoading: {...state.detailsLoading, [action.payload.name]: false}
        }),
        fetchPokemonDetailFailure: (state, action: PayloadAction<{ name: string, error: unknown }>) => ({
            ...state,
            detailsLoading: {...state.detailsLoading, [action.payload.name]: false},
            detailsError: {...state.detailsError, [action.payload.name]: action.payload.error}
        })
    }
})

export function isLoading(state: RootState) {
    return state.pokemons.loading
}

export function getPokemons(state: RootState) {
    return state.pokemons.items
}

export function getPokemonNames(state: RootState) {
    return state.pokemons.items.map(({name}) => name)
}

export function getSelectedPokemon(state: RootState) {
    return state.pokemons.selectedPokemon
}

export function getSelectedPokemonIndex(state: RootState) {
    if (!state.pokemons.selectedPokemon) return -1
    const pokemonNames = getPokemonNames(state)
    return pokemonNames.indexOf(state.pokemons.selectedPokemon.name)
}

export function getPokemonDetails(state: RootState, name: string) {
    return state.pokemons.details[name] ?? null
}

export function isPokemonDetailLoading(state: RootState, name: string) {
    return state.pokemons.detailsLoading[name] ?? false
}

export function getPokemonDetailError(state: RootState, name: string) {
    return state.pokemons.detailsError[name] ?? null
}

export function usePokemonDetails(name: string) {
    return useSelector((state: RootState) => getPokemonDetails(state, name))
}

export function usePokemonDetailLoading(name: string) {
    return useSelector((state: RootState) => isPokemonDetailLoading(state, name))
}

export function usePokemonDetailError(name: string) {
    return useSelector((state: RootState) => getPokemonDetailError(state, name))
}

export const {
    fetchPokemonsStart,
    fetchPokemonsSuccess,
    fetchPokemonsFailure,
    setSelectedPokemon,
    fetchPokemonDetailStart,
    fetchPokemonDetailSuccess,
    fetchPokemonDetailFailure,
} = pokemonSlice.actions
export default pokemonSlice.reducer
