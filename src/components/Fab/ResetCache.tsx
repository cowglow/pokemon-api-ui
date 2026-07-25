import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import {Fab} from "@mui/material";

interface ResetCacheProps {
    onClick: () => void
}

export default function ResetCache({onClick}: ResetCacheProps) {
    return (
        <Fab color="primary" aria-label="reset cached edits" size="medium" onClick={onClick}
             sx={{position: "absolute", bottom: 33, right: 33}}>
            <RestartAltRoundedIcon/>
        </Fab>
    )
}
