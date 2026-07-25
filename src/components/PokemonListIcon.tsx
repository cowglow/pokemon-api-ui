import {Badge, Box, ListItemIcon} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface PokemonListIconProps {
    pokemonIndex: number;
    label: string
    collected?: boolean
}

export default function PokemonListIcon({pokemonIndex, label, collected}: PokemonListIconProps) {
    const pokemonIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`
    return (
        <ListItemIcon>
            <Badge
                overlap="circular"
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                badgeContent={<StarRoundedIcon sx={{fontSize: 14}} color="warning"/>}
                invisible={!collected}
            >
                <Box component="img" src={pokemonIconUrl} alt={label} sx={{width: 40, height: 40, objectFit: "contain"}}/>
            </Badge>
        </ListItemIcon>
    )
}