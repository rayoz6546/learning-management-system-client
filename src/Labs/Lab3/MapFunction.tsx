const MapFunction = () => {
    let numberArray1: Array<number> = [1, 2, 3, 4, 5, 6];
    const square = (a: number) => a * a;
    const todos: Array<String> = ["Buy milk", "Feed the pets"];
    const squares: Array<number> = numberArray1.map(square);
    const cubes: Array<number> = numberArray1.map((a) => a * a * a);
    return (
        <div id="wd-map-function">
            <h4>Map Function</h4>
            squares = {squares} <br />
            cubes = {cubes} <br />
            Todos:
            <ol>
                {todos.map((todo) => (
                    <li>{todo}</li>
                ))}
            </ol> <hr />
        </div>
    );
}

export default MapFunction;
