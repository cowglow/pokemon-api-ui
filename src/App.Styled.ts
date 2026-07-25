import {Box, styled} from "@mui/material";


export const LayoutWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100svh;

    & > header {
        flex-shrink: 0;
    }

    & > main {
        flex: 1;
        overflow: auto;
    }
`
export const ContentWrapper = styled(Box)`
    display: flex;
    height: calc(100% - ${({theme}) => theme.spacing(2)});
    margin: ${({theme}) => theme.spacing(1)};
    padding: ${({theme}) => theme.spacing(0.5)};
    overflow: hidden;
    gap: ${({theme}) => theme.spacing(1)};
`
