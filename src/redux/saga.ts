import {takeEvery} from "redux-saga/effects";
import {fetchPokemonsHandler} from "./saga-handlers/fetchPokemonsHandler.ts";
import {fetchPokemonDetailHandler} from "./saga-handlers/fetchPokemonDetailHandler.ts";
import {syncSelectedPokemonUrlHandler} from "./saga-handlers/syncSelectedPokemonUrlHandler.ts";
import {syncCollectionToLocalStorageHandler} from "./saga-handlers/syncCollectionToLocalStorageHandler.ts";
import {syncUserNameToLocalStorageHandler} from "./saga-handlers/syncUserNameToLocalStorageHandler.ts";
import {syncUserSkippedToLocalStorageHandler} from "./saga-handlers/syncUserSkippedToLocalStorageHandler.ts";
import {fetchPokemonDetailStart, fetchPokemonsStart, setSelectedPokemon} from "./reducers/pokemons.ts";
import {addToCollection, clearCollection, removeFromCollection, reorderCollection} from "./reducers/collection.ts";
import {setUserName, skipOnboarding} from "./reducers/user.ts";

export function* watchSaga() {
    yield takeEvery(fetchPokemonsStart, fetchPokemonsHandler)
    yield takeEvery(fetchPokemonDetailStart, fetchPokemonDetailHandler)
    yield takeEvery(setSelectedPokemon, syncSelectedPokemonUrlHandler)
    yield takeEvery(
        [addToCollection, removeFromCollection, clearCollection, reorderCollection],
        syncCollectionToLocalStorageHandler
    )
    yield takeEvery(setUserName, syncUserNameToLocalStorageHandler)
    yield takeEvery(skipOnboarding, syncUserSkippedToLocalStorageHandler)
}
