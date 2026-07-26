import {useState} from "react";
import {useDispatch} from "react-redux";
import {Fab} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {Pokemon} from "../../types/pokemon.ts";
import {
    addToCollection,
    removeFromCollection,
    useCollectionItemId,
    useIsInCollection
} from "../../redux/reducers/collection.ts";
import RemoveFromCollectionDialog from "../RemoveFromCollectionDialog.tsx";

type AddToCollectionProps = {
    pokemon: Pokemon | null
}

export default function AddToCollection({pokemon}: AddToCollectionProps) {
    const dispatch = useDispatch()
    const name = pokemon?.name ?? ""
    const inCollection = useIsInCollection(name)
    const collectionItemId = useCollectionItemId(name)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const onClick = () => {
        if (!pokemon) return
        if (inCollection) {
            setConfirmOpen(true)
        } else {
            dispatch(addToCollection(pokemon))
        }
    }

    const onConfirmRemove = () => {
        if (collectionItemId) dispatch(removeFromCollection(collectionItemId))
        setConfirmOpen(false)
    }

    return (
        <>
            <Fab
                color={inCollection ? "primary" : "inherit"}
                aria-label={inCollection ? "remove from collection" : "add to collection"}
                size="medium"
                onClick={onClick}
                disabled={!pokemon}
                sx={{position: "fixed", bottom: 33, right: 33}}
            >
                <StarRoundedIcon color={inCollection ? "inherit" : "disabled"}/>
            </Fab>
            <RemoveFromCollectionDialog
                open={confirmOpen}
                pokemonName={name}
                onConfirm={onConfirmRemove}
                onClose={() => setConfirmOpen(false)}
            />
        </>
    )
}
