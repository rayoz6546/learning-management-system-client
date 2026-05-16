const ConditionalOutputInline = () => {
    const loggedIn: boolean = false;
    return (
        <div id="wd-conditional-output-inline">
            {loggedIn && <h2>Welcome Inline</h2>}
            {!loggedIn && <h2>Please Login Inline</h2>}
        </div>
    );
};

export default ConditionalOutputInline;
