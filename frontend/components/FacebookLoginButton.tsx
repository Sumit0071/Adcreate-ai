import FacebookLogin, { SuccessResponse } from "@greatsumini/react-facebook-login"

import { useState } from "react";
export const FacebookLoginButton = () => {
    const [message, setMessage] = useState<{ text: string, severity: "error" | "success" }>();
    const onSucceshandler = ( response: SuccessResponse ) => {
        console.log( response );
    }
    return (
        <div>
            <FacebookLogin
                appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
                onSuccess={onSucceshandler}
                onFail={( error ) => {
                    setMessage( { text: "Facebook login failed", severity: "error" } )
                }}
                onProfileSuccess={( response ) => {
                    console.log( 'Get Profile Success!', response );
                }}
                render={( { onClick } ) =>
                    <button onClick={onClick}>
                        Login with Facebook
                    </button>
                } />
        </div>
    )
}