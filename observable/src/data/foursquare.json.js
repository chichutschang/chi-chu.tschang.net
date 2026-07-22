import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

//resolve path to the .env file in the main chi-chu.tschang.net folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true});

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
//console.error(ACCESS_TOKEN)


// function to fetch ALL user check-ins from Foursquare API, paginating in batches of 250
const CheckIns = async () => {
    const limit = 250;
    let offset = 0;
    let items = [];
    let total = Infinity;

    while (offset < total) {
        console.error(`Fetching offset ${offset}...`)
        //fetches one "page" of check-ins (up to 250 limit) from Foursquare API
        const res = await fetch(
            `https://api.foursquare.com/v2/users/self/checkins?oauth_token=${ACCESS_TOKEN}&v=20240101&m=swarm&limit=${limit}&offset=${offset}`
        );
        //keeps track of remaining number of API requests left before hitting Foursquare's rate limit
        console.error('Remaining:', res.headers.get('X-RateLimit-Remaining'));
        //keeps track of Foursquare's rate limit
        console.error('Limit:', res.headers.get('X-RateLimit-Limit'));
        //parse the response body as JSON
        const data = await res.json();
        //safety check: if Foursquare returns an error, data.response.checkins won't exist. stops cleaning instead of crashing on "Cannot read properties of undefined"
        if (!data.response || !data.response.checkins) {
            throw new Error(JSON.stringify(data.meta));
        }
        //pull out the true total check-in count
        const { count, items: batch } = data.response.checkins;
        total = count;
        items = items.concat(batch);
        offset += limit;

        // wait 1 second before the next request to avoid tripping Foursquare's rate limited
        await new Promise(r => setTimeout(r, 1000));
    }
    //returns complete array of all check-ins
    console.error(`Finished. Total check-ins fetched: ${items.length}`)
    return items;
}
const items = await CheckIns();
process.stdout.write(JSON.stringify(items));