import {Badge, Box, ListItemIcon, useTheme} from "@mui/material";
import {getPokemonIdFromUrl, getPokemonSpriteUrl} from "../lib/sprite-url.ts";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface PokemonListIconProps {
    url: string;
    label: string
    collected?: boolean
}

export default function PokemonListIcon({url, label, collected}: PokemonListIconProps) {
    const pokemonIconUrl = getPokemonSpriteUrl(getPokemonIdFromUrl(url))
    const theme = useTheme()
    const pokemonSize = theme.spacing(8)
    return (
        <ListItemIcon>
            <Badge
                overlap="circular"
                anchorOrigin={{vertical: "top", horizontal: "left"}}
                badgeContent={<StarRoundedIcon sx={{fontSize: 14}} color="warning"/>}
                invisible={!collected}
            >
                <Box component="img" src={pokemonIconUrl} alt={label}
                     sx={{width: pokemonSize, height: pokemonSize, objectFit: "contain"}}/>
            </Badge>
        </ListItemIcon>
    );
}