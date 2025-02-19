import {UserDetailsResponse} from "./types";
import https from "https";

export const getUserDetails = async (userId: string, jwt?: string): Promise<UserDetailsResponse> => {
    return await fetch<UserDetailsResponse>(
        `/2017-06-30/users/` + userId + `?fields=id,username,creationDate,streak,inviteURL,totalXp,courses,trackingProperties,xpGains,streakData`,
        jwt
    );
};

function fetch<Type>(path: string, jwt?: string): Promise<Type> {
    return new Promise<Type>((response, reject) => {
        https.get(
            {
                host: 'www.duolingo.com',
                path: path,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'duolingo-readme-stats',
                    'Cookie': `jwt_token=${jwt}`
                }
            },
            callback => {
                let data = '';

                callback.on('data', chunk => (data += chunk));
                callback.on('end', () => response(JSON.parse(data)));
                callback.on('error', error => reject(error));
            }
        );
    });
}