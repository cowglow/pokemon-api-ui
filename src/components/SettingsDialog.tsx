import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography} from "@mui/material";

const REPO_NAME = "pokemon-api-ui"
const REPO_URL = "https://github.com/cowglow/pokemon-api-ui"

type SettingsDialogProps = {
    open: boolean
    onClose: () => void
}

export default function SettingsDialog({open, onClose}: SettingsDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>About</DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">{REPO_NAME}</Typography>
                    <Link href={REPO_URL} target="_blank" rel="noopener noreferrer" variant="body2">
                        {REPO_URL}
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        Revision: {__GIT_REVISION__}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
