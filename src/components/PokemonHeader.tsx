import {Box, capitalize, Skeleton, Typography} from "@mui/material";
import AnimatedSprite from "./AnimatedSprite.tsx";

type PokemonHeaderProps = {
    name: string
    loading: boolean
    spriteFrames?: string[]
}

export default function PokemonHeader({name, loading, spriteFrames}: PokemonHeaderProps) {
    return (
        <Box sx={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
            <Typography variant="h1" component="h1">
                {capitalize(name)}
            </Typography>
            {loading && <Skeleton width={96} height={96}/>}
            {!loading && spriteFrames && spriteFrames.length > 0 && (
                <AnimatedSprite frames={spriteFrames} fps={1}/>
            )}
        </Box>
    )
}
