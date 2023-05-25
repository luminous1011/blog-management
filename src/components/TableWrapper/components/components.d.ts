import { MouseEventHandler } from "react";

export type SearchBtnCrtlsItem = {
    content: string;
    type: "default" | "primary" | "link" | "text" | "ghost" | "dashed" | undefined;
    event: MouseEventHandler<HTMLElement> | undefined;
    loading?: boolean;
    visibleSwitch?: boolean
}
