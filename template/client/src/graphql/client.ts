import {
    OfflineClient
} from 'offix-client';
import { Auth } from '@aerogear/auth';
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

export const createClient = (auth: Auth) => {
    let authLink;
    let terminatingLink; 
    const httpLink = createHttpLink({
        uri: 'http://localhost:4000/graphql',
    })

    if (auth) {
        authLink = setContext(async (operation, prevContext) => {
            console.log('auth context provider function calleed')
            const authContext = await auth.getAuthContextProvider()
            console.log('authContext', authContext)
            return authContext
        });
    }

    if (authLink) {
        console.log('auth link')
        terminatingLink = authLink.concat(httpLink)
    } else {
        console.log('using http link')
        terminatingLink = httpLink
    }

    console.log('terminating link', terminatingLink)

    const config = {
        httpUrl: "http://localhost:4000/graphql",
        //wsUrl: "ws://localhost:4000/graphql",
        terminatingLink
    }

    const client = new OfflineClient(config);
    return client.init();
}
