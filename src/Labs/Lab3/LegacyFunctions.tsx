export default function LegacyFunctions() {
    const twoPlusFour: number = add(2, 4);
    console.log(twoPlusFour);
    return (
        <div id="wd-legacy-functions">
            <h4>Functions </h4>
            <h5>Legacy ES5 functions</h5>
            twoPlusFour = {twoPlusFour}
            <br />
            add(2, 4) = {add(2, 4)}
            <hr />
        </div>
    );
}

function add(a: number, b: number): number {
    return a + b;
}
