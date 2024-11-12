import { useMsal } from '@azure/msal-react';
import React from "react";
const LoginPage = () => {
    const { instance } = useMsal();

    const initializeSignIn = () => {
        instance.loginRedirect();
    };

    return (
        <>
            <button onClick={initializeSignIn}>Sign in</button>
        </>
    );
};

export default LoginPage