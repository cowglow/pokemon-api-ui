import {FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {setUserName, useUserName} from "../redux/reducers/user.ts";
import {clearCollection, useCollection} from "../redux/reducers/collection.ts";

const REPO_NAME = "pokemon-api-ui"
const REPO_URL = "https://github.com/cowglow/pokemon-api-ui"

export default function SettingsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userName = useUserName()
    const collection = useCollection()
    const [nameDraft, setNameDraft] = useState(userName ?? "")
    const [confirmClearOpen, setConfirmClearOpen] = useState(false)

    const onSubmitName = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = nameDraft.trim()
        if (trimmed) dispatch(setUserName(trimmed))
    }

    const onConfirmClear = () => {
        dispatch(clearCollection())
        setConfirmClearOpen(false)
    }

    return (
        <Paper sx={{p: 3, display: "flex", flexDirection: "column", gap: 3, maxWidth: 480, width: "100%"}}>
            <Box component="form" onSubmit={onSubmitName} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant="h6">Your name</Typography>
                <TextField
                    fullWidth
                    label="Your name"
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!nameDraft.trim() || nameDraft.trim() === userName}
                    sx={{alignSelf: "flex-start"}}
                >
                    Save
                </Button>
            </Box>

            <Divider/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant="h6">Collection</Typography>
                <Button
                    color="error"
                    variant="outlined"
                    disabled={collection.length === 0}
                    onClick={() => setConfirmClearOpen(true)}
                    sx={{alignSelf: "flex-start"}}
                >
                    Clear collection
                </Button>
            </Box>

            <Divider/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                <Typography variant="body2">{REPO_NAME}</Typography>
                <Link href={REPO_URL} target="_blank" rel="noopener noreferrer" variant="body2">
                    {REPO_URL}
                </Link>
                <Typography variant="body2" color="text.secondary">
                    Revision: {__GIT_REVISION__}
                </Typography>
            </Box>

            <Button onClick={() => navigate(-1)} sx={{alignSelf: "flex-start"}}>
                Back
            </Button>

            <Dialog open={confirmClearOpen} onClose={() => setConfirmClearOpen(false)}>
                <DialogTitle>Clear collection?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remove all {collection.length} pokémon from your collection? This can't be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmClearOpen(false)}>Keep</Button>
                    <Button color="error" onClick={onConfirmClear}>Clear</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}
