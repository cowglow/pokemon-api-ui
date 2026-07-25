import {ListItemIcon} from "@mui/material";

interface PokemonListIconProps {
    pokemonIndex: number;
    label: string
}

export default function PokemonListIcon({pokemonIndex, label}: PokemonListIconProps) {
    const pokemonIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`
    return (
        <ListItemIcon>
            <img src={pokemonIconUrl} alt={label}/>
        </ListItemIcon>
    )
}