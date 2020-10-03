const request = require('request');

class Places {

    static findPlace(key, URL, textQuery) {

        const fields = ['name','photos','place_id','formatted_address','types'];

        return new Promise((resolve, reject) => {
            request(`${URL}/findplacefromtext/json?input=${textQuery}&inputtype=textquery&fields=${fields}&key=${key}`, 
                    (err, response, body) => {
                        const { status, candidates } = JSON.parse(body);
                        if (err === null && status === 'OK') {
                            return resolve(candidates);

                        } else {
                            if (err !== null) {

                                return reject({
                                    err,
                                    statusCode: response.statusCode,
                                });
                            } else {

                                return reject({
                                    err: status,
                                    statusCode: 400,
                                });
                            }
                        }
                    });  
        });        
    }

    static findPlaceDetails(key, URL, placeId) {

        const fields = ['photos', 'address_components', 'formatted_phone_number'];

        return new Promise((resolve, reject) => {
            request(`${URL}/details/json?place_id=${placeId}&fields=${fields}&key=${key}`,
                (err, response, body) => {

                    const { status, result } = JSON.parse(body);
                        if (err === null && status === 'OK') {
                            return resolve(result);

                        } else {
                            if (err !== null) {

                                return reject({
                                    err,
                                    statusCode: response.statusCode,
                                });
                            } else {

                                return reject({
                                    err: status,
                                    statusCode: 400,
                                });
                            }
                        }
                })
        });

    }   

}

module.exports = Places;