import {Box, capitalize, Chip, Typography} from "@mui/material";
import {PokemonAbilitySummary} from "../lib/PokemonType.ts";

type AbilitiesAndTypesProps = {
    types: string[]
    abilities: PokemonAbilitySummary[]
}

export default function AbilitiesAndTypes({types, abilities}: AbilitiesAndTypesProps) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, py: 2}}>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Types
                </Typography>
                <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                    {types.map((type) => (
                        <Chip key={type} label={capitalize(type)} size="small"/>
                    ))}
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Abilities
                </Typography>
                <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                    {abilities.map(({name, isHidden}) => (
                        <Chip
                            key={name}
                            label={isHidden ? `${capitalize(name)} (hidden)` : capitalize(name)}
                            size="small"
                            variant={isHidden ? "outlined" : "filled"}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
