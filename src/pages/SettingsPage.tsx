import {Box, Button, Link, Paper, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const REPO_NAME = "pokemon-api-ui"
const REPO_URL = "https://github.com/cowglow/pokemon-api-ui"

export default function SettingsPage() {
    const navigate = useNavigate()

    return (
        <Paper sx={{p: 3, display: "flex", flexDirection: "column", gap: 2, maxWidth: 480, width: "100%"}}>
            <Typography variant="h5">About</Typography>
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
        </Paper>
    )
}
