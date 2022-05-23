import axios from 'axios';

import { Match } from '../types';

export const checkUrls = async (urls: string[]): Promise<Match[]> => {
    const request = axios.create({
        baseURL: 'https://safebrowsing.googleapis.com',
        headers: { 'Content-Type': 'application/json' },
        params: { key: process.env.SAFE_BROWSING_KEY }
    })

    const payload = {
        client: {
            clientId: process.env.npm_package_name,
            clientVersion: process.env.npm_package_version,
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'SOCIAL_ENGINEERING', 'THREAT_TYPE_UNSPECIFIED', 'UNWANTED_SOFTWARE'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: urls.map(url => ({ url })),
        },
    }

    return (await request.post('/v4/threatMatches:find', payload)).data.matches
}
