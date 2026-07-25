import {select} from "redux-saga/effects";
import {getCollection} from "../reducers/collection.ts";
import {setStoredCollection} from "../../lib/collection-storage.ts";

export function* syncCollectionToLocalStorageHandler() {
    const items: ReturnType<typeof getCollection> = yield select(getCollection)
    setStoredCollection(items)
}
