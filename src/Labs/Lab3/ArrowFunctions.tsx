export default function ArrowFunctions() {
    const threeMinusOne = subtract(3, 1);
    console.log(threeMinusOne);
    return (
        <div id="wd-arrow-function">
            <h4>New ES6 arrow functions</h4>
            threeMinusOne = {threeMinusOne}
            <br />
            subtract(3, 1) = {subtract(3, 1)}
            <hr />
        </div>
    );
}

const subtract = (a: number, b: number): number => {
    return a - b;
}
