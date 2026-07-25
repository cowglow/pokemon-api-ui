import {useMemo, useState} from "react";
import {Box, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import {PokemonMoveSummary} from "../lib/PokemonType.ts";
import {formatKebabCase} from "../lib/format-name.ts";

type MovesProps = {
    moves: PokemonMoveSummary[]
}

export default function Moves({moves}: MovesProps) {
    const [search, setSearch] = useState("")

    const filteredMoves = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return moves
        return moves.filter(({name}) => name.includes(query))
    }, [moves, search])

    return (
        <Box sx={{py: 2}}>
            <TextField
                label="Search moves"
                size="small"
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{mb: 1}}
            />
            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                {filteredMoves.length} of {moves.length} moves
            </Typography>
            <List dense sx={{maxHeight: 320, overflow: "auto"}}>
                {filteredMoves.map(({name, method, level}) => (
                    <ListItem key={name} disableGutters>
                        <ListItemText
                            primary={formatKebabCase(name)}
                            secondary={level !== null ? `Level ${level}` : formatKebabCase(method)}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
