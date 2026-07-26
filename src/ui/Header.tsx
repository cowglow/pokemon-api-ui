import {AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Branding from "../components/Branding.tsx";
import {useUserName} from "../redux/reducers/user.ts";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const userName = useUserName()
    const location = useLocation()
    const navigate = useNavigate()

    const closeMenu = () => setMenuOpen(false)

    const selectView = (path: string) => {
        navigate(path)
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
                            <ListItemButton selected={location.pathname === "/"} onClick={() => selectView("/")}>
                                <ListItemText primary="Pokémon"/>
                            </ListItemButton>
                            <ListItemButton selected={location.pathname === "/collection"} onClick={() => selectView("/collection")}>
                                <ListItemText primary={userName ? `${userName}'s Collection` : "My Collection"}/>
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>
                <Box sx={{flexGrow: 1}}/>
                <IconButton color="inherit" onClick={() => navigate("/settings")} aria-label="settings">
                    <SettingsRoundedIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
