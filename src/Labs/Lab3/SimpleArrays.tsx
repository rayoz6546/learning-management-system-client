const SimpleArrays = () => {
    var functionScoped: number = 2;
    let blockScoped: number = 5;
    const constant1: number = functionScoped - blockScoped;
    let numberArray1: Array<number> = [1, 2, 3, 4, 5];
    let stringArray1: Array<String> = ["string1", "string2"];
    let htmlArray1: Array<JSX.Element> = [<li>Buy Milk</li>, <li>Feed the pets</li>];
    let variableArray1: Array<any> = [functionScoped, blockScoped, constant1, numberArray1, stringArray1];

    return (
        <div id="wd-simple-arrays">
            <h4>Simple Arrays</h4>
            numberArray1 = {numberArray1}      <br />
            stringArray1 = {stringArray1}      <br />
            variableArray1 = {variableArray1}  <br />
            Todo List:
            <ol>{htmlArray1}</ol>
            <hr />
        </div>
    );
}

export default SimpleArrays;
