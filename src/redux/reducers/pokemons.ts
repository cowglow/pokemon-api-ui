import {Pokemon} from "../../types/pokemon.ts";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store-config.ts";

export type PokemonState = {
    items: Pokemon[],
    loading: boolean,
    error: unknown,
    selectedPokemon: Pokemon | null
}
const initialState: PokemonState = {
    items: [],
    loading: false,
    error: null,
    selectedPokemon: null,
}

const pokemonSlice = createSlice({
    name: "pokemons",
    initialState,
    reducers: {
        fetchPokemonsStart: (state, _action) => ({
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

export const {
     fetchPokemonsStart,
    fetchPokemonsSuccess,
    fetchPokemonsFailure,
    setSelectedPokemon,
} = pokemonSlice.actions
export default pokemonSlice.reducer
