import { ReactNode } from "react"

const Square = ({ children }: { children: ReactNode }) => {
    const num = Number(children);
    return (
        <span id="wd-square">{num * num}</span>
    );
}

export default Square
