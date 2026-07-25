import {select} from "redux-saga/effects";
import {getUserName} from "../reducers/user.ts";
import {setStoredUserName} from "../../lib/user-storage.ts";

export function* syncUserNameToLocalStorageHandler() {
    const name: ReturnType<typeof getUserName> = yield select(getUserName)
    if (name) setStoredUserName(name)
}
