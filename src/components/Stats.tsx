import {Box, LinearProgress, Typography} from "@mui/material";
import {PokemonStatSummary} from "../lib/PokemonType.ts";
import {formatKebabCase} from "../lib/format-name.ts";

const MAX_BASE_STAT = 255

function formatStatName(name: string) {
    if (name === "hp") return "HP"
    return formatKebabCase(name)
}

type StatsProps = {
    stats: PokemonStatSummary[]
}

export default function Stats({stats}: StatsProps) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1.5, py: 2}}>
            {stats.map(({name, baseStat}) => (
                <Box key={name}>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Typography variant="body2">{formatStatName(name)}</Typography>
                        <Typography variant="body2" color="text.secondary">{baseStat}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={(baseStat / MAX_BASE_STAT) * 100}
                        sx={{height: 8, borderRadius: 4}}
                    />
                </Box>
            ))}
        </Box>
    )
}
