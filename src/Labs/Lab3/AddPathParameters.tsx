import { useParams } from "react-router";

const AddPathParameters = () => {
    const { a, b } = useParams();
    return (
        <div id="wd-add">
            <h4>Add Path Parameters</h4>
            {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
        </div>
    );
}

export default AddPathParameters;
