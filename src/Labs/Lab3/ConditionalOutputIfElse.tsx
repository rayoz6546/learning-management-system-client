const ConditionalOutputIfElse = () => {
    const loggedIn: boolean = true;
    if (loggedIn) {
        return (
            <h2 id="wd-conditional-output-if-else-welcome">
                Welcome If Else
            </h2>
        );
    } else {
        return (
            <h2 id="wd-conditional-output-if-else-login">
                Please log If Else
            </h2>
        )
    }
};

export default ConditionalOutputIfElse;
