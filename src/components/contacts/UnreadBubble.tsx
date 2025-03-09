import React from "react";

const MAX_DISPLAY_COUNT = 999;

interface UnreadBubbleProps {
  count: number;
}

const UnreadBubble: React.FC<UnreadBubbleProps> = ({ count }) => {
    if (count <= 0) return null;

    return (
        <div className={"absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs pt-0.5 pb-0.5 pl-1.5 pr-1.5 flex items-center justify-center translate-x-1/2 -translate-y-1/2"}>
            {count >= MAX_DISPLAY_COUNT ? `+${MAX_DISPLAY_COUNT}` : count}
        </div>
    );
};

export default UnreadBubble;