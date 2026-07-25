import {capitalize} from "@mui/material";

export function formatKebabCase(value: string) {
    return value.split("-").map(capitalize).join(" ")
}
