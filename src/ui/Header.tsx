import {AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {useState} from "react";
import Branding from "../components/Branding.tsx";
import SettingsDialog from "../components/SettingsDialog.tsx";
import {useUserName} from "../redux/reducers/user.ts";

export type AppView = "pokemons" | "collection"

type HeaderProps = {
    view: AppView
    onViewChange: (view: AppView) => void
}

export default function Header({view, onViewChange}: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const userName = useUserName()

    const closeMenu = () => setMenuOpen(false)

    const selectView = (next: AppView) => {
        onViewChange(next)
        closeMenu()
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit" edge="start" onClick={() => setMenuOpen(true)} aria-label="navigation menu">
                    <MenuRoundedIcon/>
                </IconButton>
                <Branding/>
                <Drawer anchor="left" open={menuOpen} onClose={closeMenu}>
                    <Box sx={{width: 240}} role="presentation">
                        <List>
                            <ListItemButton selected={view === "pokemons"} onClick={() => selectView("pokemons")}>
                                <ListItemText primary="Pokémon"/>
                            </ListItemButton>
                            <ListItemButton selected={view === "collection"} onClick={() => selectView("collection")}>
                                <ListItemText primary={userName ? `${userName}'s Collection` : "My Collection"}/>
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>
                <Box sx={{flexGrow: 1}}/>
                <IconButton color="inherit" onClick={() => setSettingsOpen(true)} aria-label="settings">
                    <SettingsRoundedIcon/>
                </IconButton>
                <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)}/>
            </Toolbar>
        </AppBar>
    )
}
