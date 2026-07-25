import {Box, Paper, Typography} from "@mui/material";
import {useCollection} from "../redux/reducers/collection.ts";
import PokemonCollectionCard from "./PokemonCollectionCard.tsx";

export default function CollectionView() {
    const collection = useCollection()

    if (collection.length === 0) {
        return (
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", p: 4}}>
                <Paper elevation={0} sx={{p: 4, textAlign: "center", maxWidth: 360}}>
                    <Typography variant="h6" gutterBottom>
                        Your collection is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Select a pokémon from the list and use the + button to add it to your collection.
                    </Typography>
                </Paper>
            </Box>
        )
    }

    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "flex-start",
            gap: 2,
            p: 2,
            width: "100%",
            overflow: "auto"
        }}>
            {collection.map(({id, pokemon}) => (
                <PokemonCollectionCard key={id} pokemon={pokemon}/>
            ))}
        </Box>
    )
}
