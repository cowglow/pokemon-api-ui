import {Box, IconButton, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function PokemonSearch() {
    return (
        <form>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <TextField
                    variant="filled"
                    placeholder="Search for a Pokémon..."
                    InputProps={{
                        style: {backgroundColor: "white"}
                    }}
                />
                <IconButton sx={{background: "white", marginLeft: 1}} type="submit">
                    <SearchIcon/>
                </IconButton>
            </Box>
        </form>
    );
}