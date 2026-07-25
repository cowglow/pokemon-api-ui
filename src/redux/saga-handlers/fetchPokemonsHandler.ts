import {PayloadAction} from "@reduxjs/toolkit";
import {PokemonApiResponse} from "../../types/pokemon.ts";
import {call, put} from 'redux-saga/effects'
import {requestPokemons} from "../saga-requests/request-pokemons.ts";
import {fetchPokemonsFailure, fetchPokemonsSuccess, setSelectedPokemon} from "../reducers/pokemons.ts";
import {getUrlParam} from "../../lib/url-param.ts";

export function* fetchPokemonsHandler(action: PayloadAction<number>) {
    try {
        const {results}: PokemonApiResponse = yield call(requestPokemons, action.payload)
        yield put(fetchPokemonsSuccess(results))
        const selectedName = getUrlParam("pokemon")
        const selected = results.find(({name}) => name === selectedName) ?? results[0]
        yield put(setSelectedPokemon(selected))
    } catch (error) {
        yield put(fetchPokemonsFailure(error));
    }
}
