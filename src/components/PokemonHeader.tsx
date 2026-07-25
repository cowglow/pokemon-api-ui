import {useState} from "react";
import {useDispatch} from "react-redux";
import {Box, capitalize, IconButton, Skeleton, Typography} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AnimatedSprite from "./AnimatedSprite.tsx";
import RemoveFromCollectionDialog from "./RemoveFromCollectionDialog.tsx";
import {removeFromCollection, useCollectionItemId, useIsInCollection} from "../redux/reducers/collection.ts";

type PokemonHeaderProps = {
    name: string
    loading: boolean
    spriteFrames?: string[]
}

export default function PokemonHeader({name, loading, spriteFrames}: PokemonHeaderProps) {
    const dispatch = useDispatch()
    const inCollection = useIsInCollection(name)
    const collectionItemId = useCollectionItemId(name)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const onConfirmRemove = () => {
        if (collectionItemId) dispatch(removeFromCollection(collectionItemId))
        setConfirmOpen(false)
    }

    return (
        <Box sx={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
            <Box sx={{display: "flex", alignItems: "flex-start", gap: 0.5}}>
                <Typography variant="h1" component="h1">
                    {capitalize(name)}
                </Typography>
                {inCollection && (
                    <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="remove from collection">
                        <StarRoundedIcon color="warning"/>
                    </IconButton>
                )}
                <RemoveFromCollectionDialog
                    open={confirmOpen}
                    pokemonName={name}
                    onConfirm={onConfirmRemove}
                    onClose={() => setConfirmOpen(false)}
                />
            </Box>
            {loading && <Skeleton width={96} height={96}/>}
            {!loading && spriteFrames && spriteFrames.length > 0 && (
                <AnimatedSprite frames={spriteFrames} fps={1}/>
            )}
        </Box>
    )
}
