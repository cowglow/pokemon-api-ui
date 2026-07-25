import {takeEvery} from "redux-saga/effects";
import {fetchPokemonsHandler} from "./saga-handlers/fetchPokemonsHandler.ts";
import {fetchPokemonDetailHandler} from "./saga-handlers/fetchPokemonDetailHandler.ts";
import {syncSelectedPokemonUrlHandler} from "./saga-handlers/syncSelectedPokemonUrlHandler.ts";
import {fetchPokemonDetailStart, fetchPokemonsStart, setSelectedPokemon} from "./reducers/pokemons.ts";

export function* watchSaga() {
    yield takeEvery(fetchPokemonsStart, fetchPokemonsHandler)
    yield takeEvery(fetchPokemonDetailStart, fetchPokemonDetailHandler)
    yield takeEvery(setSelectedPokemon, syncSelectedPokemonUrlHandler)
}
