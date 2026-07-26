import {useState} from "react";
import {useDispatch} from "react-redux";
import {Box, capitalize, Chip, IconButton, Paper, Skeleton, styled, Typography} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {Pokemon} from "../types/pokemon.ts";
import {usePokemonDetail} from "../hooks/usePokemonDetail.ts";
import {getTypeColor} from "../lib/type-colors.ts";
import {removeFromCollection} from "../redux/reducers/collection.ts";
import RemoveFromCollectionDialog from "./RemoveFromCollectionDialog.tsx";

type PokemonCollectionCardProps = {
    id: string
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

export default function PokemonCollectionCard({id, pokemon}: PokemonCollectionCardProps) {
    const dispatch = useDispatch()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const {data, loading} = usePokemonDetail(pokemon.name, pokemon.url)
    const [primaryType] = data?.types ?? []
    const accent = getTypeColor(primaryType ?? "")
    const hp = data?.stats.find(({name}) => name === "hp")?.baseStat

    const onConfirmRemove = () => {
        dispatch(removeFromCollection(id))
        setConfirmOpen(false)
    }

    return (
        <CardShell elevation={3} accent={accent}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
                    {capitalize(pokemon.name)}
                </Typography>
                <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                    {hp !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                            HP {hp}
                        </Typography>
                    )}
                    <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="remove from collection">
                        <StarRoundedIcon fontSize="small" color="warning"/>
                    </IconButton>
                </Box>
            </Box>
            <ArtworkFrame accent={accent}>
                {loading && <Skeleton variant="circular" width={96} height={96}/>}
                {data?.avatar && (
                    <Box component="img" src={data.avatar} alt="" sx={{
                        width: 96,
                        height: 96,
                        imageRendering: "pixelated"
                    }}/>
                )}
            </ArtworkFrame>
            <Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center"}}>
                {data?.types.map((type) => (
                    <Chip key={type} label={capitalize(type)} size="small"
                          sx={{bgcolor: getTypeColor(type), color: "#fff"}}/>
                ))}
            </Box>
            <RemoveFromCollectionDialog
                open={confirmOpen}
                pokemonName={pokemon.name}
                onConfirm={onConfirmRemove}
                onClose={() => setConfirmOpen(false)}
            />
        </CardShell>
    )
}
