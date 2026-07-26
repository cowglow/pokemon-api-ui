import {combineReducers, configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import pokemonReducers from "./reducers/pokemons.ts";
import collectionReducers from "./reducers/collection.ts";
import userReducers from "./reducers/user.ts";
import {watchSaga} from "./saga.ts";

const sagaMiddleware = createSagaMiddleware({
    onError: (error, {sagaStack}) => {
        // Without this, an uncaught error in any watcher (e.g. a localStorage write
        // throwing QuotaExceededError) crashes the entire saga middleware, silently
        // killing every future fetch/sync for the rest of the page's lifetime.
        console.error("Uncaught error in saga, saga middleware may be unable to recover", error, sagaStack)
    }
});

const rootReducer = combineReducers({
    pokemons: pokemonReducers,
    collection: collectionReducers,
    user: userReducers,
})

export function setupStore(preloadedState: Partial<RootState>) {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk:false}).concat(sagaMiddleware),
        devTools: true
    });
    sagaMiddleware.run(watchSaga);
    return store
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]