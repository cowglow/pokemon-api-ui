import {Pokemon} from "../types/pokemon.ts";
import PokemonForm from "./PokemonForm.tsx";

interface SelectedPokemonProps {
    pokemon: Pokemon | null
}

export default function SelectedPokemon({pokemon}: SelectedPokemonProps) {
    if (!pokemon) return null
    return (
        <PokemonForm key={`form-${pokemon.name}`} name={pokemon.name} url={pokemon.url}/>
    )
}
