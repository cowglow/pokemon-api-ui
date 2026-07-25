import {PayloadAction} from "@reduxjs/toolkit";
import {PokemonApiResponse} from "../../types/pokemon.ts";
import {call, put} from 'redux-saga/effects'
import {requestPokemons} from "../saga-requests/request-pokemons.ts";
import {fetchPokemonsFailure, fetchPokemonsSuccess} from "../reducers/pokemons.ts";

export function* fetchPokemonsHandler(action: PayloadAction<number>) {
    try {
        const {results}: PokemonApiResponse = yield call(requestPokemons, action.payload)
        yield put(fetchPokemonsSuccess(results))
    } catch (error) {
        yield put(fetchPokemonsFailure(error));
    }
}
