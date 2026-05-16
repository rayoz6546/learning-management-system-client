import { ReactNode } from "react"

const Highlight = ({ children }: { children: ReactNode }) => {
    return (
        <span id="w-highlight" style={{ backgroundColor: "yellow", color: "red" }}>
            {children}
        </span>
    );
}

export default Highlight;
