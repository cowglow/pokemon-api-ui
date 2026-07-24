import {Pokemon} from "../../types/pokemon.ts";
import {Pokemon as PokemonDetail} from "../../lib/PokemonType.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store-config.ts";

export type PokemonState = {
    items: Pokemon[],
    loading: boolean,
    error: unknown,
    selectedPokemon: Pokemon | null,
    details: Record<string, PokemonDetail>
}
const initialState: PokemonState = {
    items: [],
    loading: false,
    error: null,
    selectedPokemon: null,
    details: {},
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
        setPokemonDetails: (state, action: { payload: PokemonDetail }) => ({
            ...state,
            details: {
                ...state.details,
                [action.payload.name]: action.payload
            }
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

export const {
    fetchPokemonsStart,
    fetchPokemonsSuccess,
    fetchPokemonsFailure,
    setSelectedPokemon,
    setPokemonDetails,
} = pokemonSlice.actions
export default pokemonSlice.reducer
