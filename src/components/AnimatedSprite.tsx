import {styled} from "@mui/material";
import {useSpriteAnimation} from "./useSpriteAnimation.ts";

const Image = styled('img')<{ $size: number }>`
    padding: 0;
    margin: 0;
    width: ${({$size}) => $size}px;
    height: ${({$size}) => $size}px;
    object-fit: contain;
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
    return <Image src={currentFrame} alt="" $size={size}/>
}
