import {Pokemon} from "../types/pokemon.ts";
import PokemonForm from "./PokemonForm.tsx";
import {Paper} from "@mui/material";

interface SelectedPokemonProps {
    pokemon: Pokemon | null
}

export default function SelectedPokemon({pokemon}: SelectedPokemonProps) {
    if (!pokemon) return null
    return (
        <Paper sx={{flex: 1}}>
            <PokemonForm key={`form-${pokemon.name}`} name={pokemon.name} url={pokemon.url}/>
        </Paper>
    )
}
