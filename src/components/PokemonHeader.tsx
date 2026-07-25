import {Box, capitalize, Skeleton, Typography} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AnimatedSprite from "./AnimatedSprite.tsx";
import {useIsInCollection} from "../redux/reducers/collection.ts";

type PokemonHeaderProps = {
    name: string
    loading: boolean
    spriteFrames?: string[]
}

export default function PokemonHeader({name, loading, spriteFrames}: PokemonHeaderProps) {
    const inCollection = useIsInCollection(name)

    return (
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                <Typography variant="h4" component="h1">
                    {capitalize(name)}
                </Typography>
                {inCollection && <StarRoundedIcon color="warning" aria-label="in your collection"/>}
            </Box>
            {loading && <Skeleton width={96} height={96}/>}
            {!loading && spriteFrames && spriteFrames.length > 0 && (
                <AnimatedSprite frames={spriteFrames} fps={3}/>
            )}
        </Box>
    )
}
