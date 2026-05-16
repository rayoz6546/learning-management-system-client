const ForLoops = () => {
    let stringArray1: Array<String> = ["string1", "string3"];
    let stringArray2: Array<String> = [];
    for (let i = 0; i < stringArray1.length; i++) {
        const string1 = stringArray1[i];
        stringArray2.push(string1.toUpperCase());
    }
    return (
        <div id="wd-for-loops">
            <h4>For Loops</h4>
            stringArray2 = {stringArray2} <hr />
        </div>
    );
}

export default ForLoops; 
