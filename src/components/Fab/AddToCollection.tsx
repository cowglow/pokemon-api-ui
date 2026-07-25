import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {Fab} from "@mui/material";

interface AddToCollectionProps {
    onClick: () => void
    disabled?: boolean
}

export default function AddToCollection({onClick, disabled}: AddToCollectionProps) {
    return (
        <Fab color="primary" aria-label="add to collection" size="medium" onClick={onClick} disabled={disabled}
             sx={{position: "absolute", bottom: 33, right: 33}}>
            <AddRoundedIcon/>
        </Fab>
    )
}
