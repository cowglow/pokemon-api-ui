import {Box, capitalize, IconButton, Skeleton, Typography} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AnimatedSprite from "./AnimatedSprite.tsx";

type PokemonHeaderProps = {
    name: string
    loading: boolean
    spriteFrames?: string[]
    onBack?: () => void
}

export default function PokemonHeader({name, loading, spriteFrames, onBack}: PokemonHeaderProps) {
    return (
        <Box sx={{display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 1}}>
            <Box sx={{display: "flex", alignItems: "flex-end", gap: 1, minWidth: 0}}>
                {onBack && (
                    <IconButton
                        onClick={onBack}
                        aria-label="back to list"
                        sx={{display: {xs: "inline-flex", sm: "none"}, mb: 1, flexShrink: 0}}
                    >
                        <ArrowBackRoundedIcon/>
                    </IconButton>
                )}
                <Typography variant="h1" component="h1"
                            sx={{fontSize: {xs: "2.5rem", sm: "3.75rem", md: "6rem"}, minWidth: 0}}>
                    {capitalize(name)}
                </Typography>
            </Box>
            {loading && <Skeleton width={96} height={96}/>}
            {!loading && spriteFrames && spriteFrames.length > 0 && (
                <AnimatedSprite frames={spriteFrames} fps={3}/>
            )}
        </Box>
    )
}
