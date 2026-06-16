require('dotenv').config()
const hardcover_api = process.env.HARDCOVER_API;
//console.log(hardcover_api)
const auth_token = process.env.AUTH_TOKEN;

//query Hardcopy.app user ID & user name
const query = `query {
  me {
      id,
      username
  }
}`
//query currently reading: status_id: {_eq: 2}
const currentlyreading = `query {
    me{
        user_books(
            where: {status_id: {_eq: 2}}
        ) {
            book {
                title
                slug
                contributions {
                    author {
                        name
                    }
                }
            }
        }
    }
}`

//function to query Hardcover API with auth_token
const updateCurrentlyReading = async (query) => {
    console.log(`Connecting to ${hardcover_api}`)
    const response = await fetch(hardcover_api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        },
        body: JSON.stringify({
            query
        })
    });

    const data = await response.json();
    if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
    }
    return data.data;
}
//call function
updateCurrentlyReading(currentlyreading)
    .then((data) => console.log(JSON.stringify(data, null, 2)))
    .catch((error) => console.error(error));

module.exports = {
    currentlyreading,
    updateCurrentlyReading
}