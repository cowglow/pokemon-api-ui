import {FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {setUserName, skipOnboarding, useIsOnboarded} from "../redux/reducers/user.ts";

export default function OnboardingDialog() {
    const dispatch = useDispatch()
    const onboarded = useIsOnboarded()
    const [draft, setDraft] = useState("")

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (trimmed) dispatch(setUserName(trimmed))
    }

    return (
        <Dialog open={!onboarded}>
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
                    <Button onClick={() => dispatch(skipOnboarding())} color="inherit">
                        Skip
                    </Button>
                    <Button type="submit" variant="contained" disabled={!draft.trim()}>
                        Continue
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
