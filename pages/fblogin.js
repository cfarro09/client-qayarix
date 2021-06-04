import React from 'react';
import Layout from '../components/layout/layout'
import Head from 'next/head';

const FbLogin = () => {
    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }
    return (
        <Layout>
            <Head>
                <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v8.0" nonce="LnTECYch" />
            </Head>
            <h1>Holis</h1>
            <div className="fb-login-button" data-size="medium" data-button-type="login_with" data-layout="rounded" data-auto-logout-link="true" data-use-continue-as="false" data-width="" scope="public_profile,pages_show_list,pages_read_engagement" onlogin="checkLoginState();"></div>
        </Layout>
    );
}

export default FbLogin;