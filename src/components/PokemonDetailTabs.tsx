import {ReactNode, SyntheticEvent, useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";

type TabDef = {
    label: string
    content: ReactNode
}

type PokemonDetailTabsProps = {
    tabs: TabDef[]
}

export default function PokemonDetailTabs({tabs}: PokemonDetailTabsProps) {
    const [activeTab, setActiveTab] = useState(0)

    const onChange = (_: SyntheticEvent, index: number) => {
        setActiveTab(index)
    }

    return (
        <Box>
            <Tabs value={activeTab} onChange={onChange} aria-label="Pokémon detail tabs">
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab.label}
                        label={tab.label}
                        id={`pokemon-tab-${index}`}
                        aria-controls={`pokemon-tabpanel-${index}`}
                    />
                ))}
            </Tabs>
            {tabs.map((tab, index) => (
                <Box
                    key={tab.label}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    id={`pokemon-tabpanel-${index}`}
                    aria-labelledby={`pokemon-tab-${index}`}
                >
                    {activeTab === index && tab.content}
                </Box>
            ))}
        </Box>
    )
}
