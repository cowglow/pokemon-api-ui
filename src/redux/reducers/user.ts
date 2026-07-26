import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {RootState} from "../store-config.ts";

export type UserState = {
    name: string | null
    skipped: boolean
}

const initialState: UserState = {
    name: null,
    skipped: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => ({
            ...state,
            name: action.payload,
            skipped: false
        }),
        hydrateUserName: (state, action: PayloadAction<string | null>) => ({
            ...state,
            name: action.payload
        }),
        skipOnboarding: (state) => ({
            ...state,
            skipped: true
        }),
        hydrateSkipped: (state, action: PayloadAction<boolean>) => ({
            ...state,
            skipped: action.payload
        })
    }
})

export function getUserName(state: RootState) {
    return state.user.name
}

export function useUserName() {
    return useSelector(getUserName)
}

export function isOnboarded(state: RootState) {
    return Boolean(state.user.name) || state.user.skipped
}

export function useIsOnboarded() {
    return useSelector(isOnboarded)
}

export const {setUserName, hydrateUserName, skipOnboarding, hydrateSkipped} = userSlice.actions
export default userSlice.reducer
