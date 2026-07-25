import {Box, Paper, Typography} from "@mui/material";
import {useCollection} from "../redux/reducers/collection.ts";
import {useUserName} from "../redux/reducers/user.ts";
import PokemonCollectionCard from "./PokemonCollectionCard.tsx";

export default function CollectionView() {
    const collection = useCollection()
    const userName = useUserName()
    const heading = userName ? `${userName}'s Collection` : "Your Collection"

    if (collection.length === 0) {
        return (
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", p: 4}}>
                <Paper elevation={0} sx={{p: 4, textAlign: "center", maxWidth: 360}}>
                    <Typography variant="h6" gutterBottom>
                        {heading} is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Select a pokémon from the list and use the star button to add it to your collection.
                    </Typography>
                </Paper>
            </Box>
        )
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", width: "100%", overflow: "hidden"}}>
            <Typography variant="h5" sx={{p: 2, pb: 0}}>
                {heading}
            </Typography>
            <Paper elevation={0} sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent: "flex-start",
                gap: 4,
                p: 4,
                flex: 1,
                minHeight: 0,
                overflow: "auto",
            }}>
                {collection.map(({id, pokemon}) => (
                    <PokemonCollectionCard key={id} id={id} pokemon={pokemon}/>
                ))}
            </Paper>
        </Box>
    )
}
