import {Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type RemoveFromCollectionDialogProps = {
    open: boolean
    pokemonName: string
    onConfirm: () => void
    onClose: () => void
}

export default function RemoveFromCollectionDialog({open, pokemonName, onConfirm, onClose}: RemoveFromCollectionDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Remove from collection?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Remove {capitalize(pokemonName)} from your collection? This can't be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Keep</Button>
                <Button color="error" onClick={onConfirm}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}
