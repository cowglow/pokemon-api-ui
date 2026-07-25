import {PayloadAction} from "@reduxjs/toolkit";
import {call, put} from 'redux-saga/effects'
import {requestPokemonDetail} from "../saga-requests/request-pokemon-detail.ts";
import {fetchPokemonDetailFailure, fetchPokemonDetailSuccess} from "../reducers/pokemons.ts";
import createPokemon from "../../lib/create-pokemon.ts";
import {PokemonResponse} from "../../lib/PokemonType.ts";

export function* fetchPokemonDetailHandler(action: PayloadAction<{ name: string, url: string }>) {
    const {name, url} = action.payload
    try {
        const json: PokemonResponse = yield call(requestPokemonDetail, url)
        yield put(fetchPokemonDetailSuccess(createPokemon(json)))
    } catch (error) {
        yield put(fetchPokemonDetailFailure({name, error}))
    }
}
