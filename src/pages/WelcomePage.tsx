import {FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {setUserName, skipOnboarding} from "../redux/reducers/user.ts";

export default function WelcomePage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [draft, setDraft] = useState("")

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed) return
        dispatch(setUserName(trimmed))
        navigate("/", {replace: true})
    }

    const onSkip = () => {
        dispatch(skipOnboarding())
        navigate("/", {replace: true})
    }

    return (
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", p: 2}}>
            <Paper
                component="form"
                onSubmit={onSubmit}
                elevation={3}
                sx={{p: 4, maxWidth: 400, width: "100%", display: "flex", flexDirection: "column", gap: 2}}
            >
                <Typography variant="h5">Welcome!</Typography>
                <Typography variant="body2" color="text.secondary">
                    What's your name? We'll use it to make your collection feel a bit more yours.
                </Typography>
                <TextField
                    autoFocus
                    fullWidth
                    label="Your name"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                />
                <Box sx={{display: "flex", gap: 1}}>
                    <Button type="submit" variant="contained" disabled={!draft.trim()}>
                        Continue
                    </Button>
                    <Button onClick={onSkip} color="inherit">
                        Skip
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}
