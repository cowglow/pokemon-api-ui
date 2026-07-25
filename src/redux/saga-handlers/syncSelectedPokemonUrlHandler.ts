import {PayloadAction} from "@reduxjs/toolkit";
import {Pokemon} from "../../types/pokemon.ts";
import {setUrlParam} from "../../lib/url-param.ts";

export function syncSelectedPokemonUrlHandler(action: PayloadAction<Pokemon | null>) {
    setUrlParam("pokemon", action.payload?.name ?? null)
}
