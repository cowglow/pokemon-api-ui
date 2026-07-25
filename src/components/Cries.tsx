import {Box, Typography} from "@mui/material";
import {PokemonCries} from "../lib/PokemonType.ts";

type CriesProps = {
    cries: PokemonCries
}

export default function Cries({cries}: CriesProps) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, py: 2}}>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Latest
                </Typography>
                <audio controls src={cries.latest}/>
            </Box>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Legacy
                </Typography>
                <audio controls src={cries.legacy}/>
            </Box>
        </Box>
    )
}
