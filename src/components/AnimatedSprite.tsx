import {Box, styled} from "@mui/material";
import {useSpriteAnimation} from "./useSpriteAnimation.ts";

const SpriteWrapper = styled(Box, {shouldForwardProp: (prop) => prop !== "$size"})<{ $size: number }>`
    width: ${({$size}) => $size}px;
    height: ${({$size}) => $size}px;
    max-width: 100%; /* Makes the box responsive on tiny screens */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: ${({theme}) => `thin solid ${theme.palette.primary.dark}`};
`
const Image = styled('img')<{ $size: number }>`
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    object-fit: contain; /* Alternatives: 'cover' or 'scale-down' */
    image-rendering: pixelated;
`;

type AnimatedSpriteProps = {
    frames: string[]
    fps?: number
    size?: number
}

export default function AnimatedSprite({frames, fps = 3, size = 96}: AnimatedSpriteProps) {
    const currentFrame = useSpriteAnimation(frames, fps)
    if (!currentFrame) return null
    return (
        <SpriteWrapper $size={size}>
            <Image src={currentFrame} alt="" $size={size}/>
        </SpriteWrapper>
    )
}
