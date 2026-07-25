import {PayloadAction} from "@reduxjs/toolkit";
import {call, delay, put} from 'redux-saga/effects'
import {requestPokemonDetail} from "../saga-requests/request-pokemon-detail.ts";
import {fetchPokemonDetailFailure, fetchPokemonDetailSuccess} from "../reducers/pokemons.ts";
import createPokemon from "../../lib/create-pokemon.ts";
import {PokemonResponse} from "../../lib/PokemonType.ts";
import {randomInt} from "../../lib/random.ts";

export function* fetchPokemonDetailHandler(action: PayloadAction<{ name: string, url: string }>) {
    const {name, url} = action.payload
    try {
        yield delay(randomInt(800, 1200))
        const json: PokemonResponse = yield call(requestPokemonDetail, url)
        yield put(fetchPokemonDetailSuccess(createPokemon(json)))
    } catch (error) {
        yield put(fetchPokemonDetailFailure({name, error}))
    }
}
