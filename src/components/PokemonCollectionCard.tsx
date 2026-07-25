import {Box, capitalize, Chip, Paper, styled, Typography} from "@mui/material";
import {Pokemon} from "../lib/PokemonType.ts";
import {getTypeColor} from "../lib/type-colors.ts";

type PokemonCollectionCardProps = {
    pokemon: Pokemon
}

const shouldForwardAccent = (prop: string) => prop !== "accent"

const CardShell = styled(Paper, {shouldForwardProp: shouldForwardAccent})<{ accent: string }>`
    width: 240px;
    border-radius: 16px;
    border: 6px solid ${({accent}) => accent};
    padding: ${({theme}) => theme.spacing(1.5)};
    display: flex;
    flex-direction: column;
    gap: ${({theme}) => theme.spacing(1)};
`

const ArtworkFrame = styled(Box, {shouldForwardProp: shouldForwardAccent})<{ accent: string }>`
    background: ${({accent}) => `${accent}22`};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
`

export default function PokemonCollectionCard({pokemon}: PokemonCollectionCardProps) {
    const [primaryType] = pokemon.types
    const accent = getTypeColor(primaryType)
    const hp = pokemon.stats.find(({name}) => name === "hp")?.baseStat

    return (
        <CardShell elevation={3} accent={accent}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
                    {capitalize(pokemon.name)}
                </Typography>
                {hp !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                        HP {hp}
                    </Typography>
                )}
            </Box>
            <ArtworkFrame accent={accent}>
                {pokemon.avatar && (
                    <Box component="img" src={pokemon.avatar} alt="" sx={{
                        width: 96,
                        height: 96,
                        imageRendering: "pixelated"
                    }}/>
                )}
            </ArtworkFrame>
            <Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center"}}>
                {pokemon.types.map((type) => (
                    <Chip key={type} label={capitalize(type)} size="small"
                          sx={{bgcolor: getTypeColor(type), color: "#fff"}}/>
                ))}
            </Box>
        </CardShell>
    )
}
