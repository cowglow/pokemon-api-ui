import {combineReducers, configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import pokemonReducers from "./reducers/pokemons.ts";
import collectionReducers from "./reducers/collection.ts";
import {watchSaga} from "./saga.ts";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    pokemons: pokemonReducers,
    collection: collectionReducers,
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