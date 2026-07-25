import {styled} from "@mui/material";
import {useSpriteAnimation} from "./useSpriteAnimation.ts";

const Image = styled('img')`
    padding: 0;
    margin: 0;
    image-rendering: pixelated;
`;

type AnimatedSpriteProps = {
    frames: string[]
    fps?: number
}

export default function AnimatedSprite({frames, fps = 3}: AnimatedSpriteProps) {
    const currentFrame = useSpriteAnimation(frames, fps)
    if (!currentFrame) return null
    return <Image src={currentFrame} alt=""/>
}
