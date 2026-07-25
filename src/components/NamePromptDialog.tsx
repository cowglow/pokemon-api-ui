import {FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {setUserName, useUserName} from "../redux/reducers/user.ts";

export default function NamePromptDialog() {
    const dispatch = useDispatch()
    const name = useUserName()
    const [draft, setDraft] = useState("")

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (trimmed) dispatch(setUserName(trimmed))
    }

    return (
        <Dialog open={!name}>
            <form onSubmit={onSubmit}>
                <DialogTitle>Welcome!</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{mb: 2}}>
                        What's your name? We'll use it to make your collection feel a bit more yours.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Your name"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" disabled={!draft.trim()}>
                        Continue
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
