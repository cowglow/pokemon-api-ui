import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {RootState} from "../store-config.ts";

export type UserState = {
    name: string | null
}

const initialState: UserState = {
    name: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => ({
            ...state,
            name: action.payload
        }),
        hydrateUserName: (state, action: PayloadAction<string | null>) => ({
            ...state,
            name: action.payload
        })
    }
})

export function getUserName(state: RootState) {
    return state.user.name
}

export function useUserName() {
    return useSelector(getUserName)
}

export const {setUserName, hydrateUserName} = userSlice.actions
export default userSlice.reducer
