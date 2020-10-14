const Places = require('../models/Places');

key = 'AIzaSyDb0sBeGCM22PxWVKeGzJH8UKXRrgpgosw';
URL = 'https://maps.googleapis.com/maps/api/place';

module.exports = {

    async searchPlace(req, res) {

        const text = req.query.text;
        let formattdText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (req.query.text) {
            try {
                let place = await Places.findPlace(key, URL, formattdText);

                console.log(place)
                for(let i = 0; i < place.length; i++) {
                    let placeDetails = await Places.findPlaceDetails(key, URL, place[i].place_id);

                    if (place[i].photos) {
                        for(let y = 0; y < place[i].photos.length; y ++){
                            let photo_url = `${URL}/photo?photoreference=${place[i].photos[y].photo_reference}&key=${key}&maxwidth=250`;
                            place[i].photos[y] = {
                                photo_url,
                                ...place[i].photos[y]
                            }
                        }
                    }

                    if (placeDetails.photos) {
                        placeDetails.photos.forEach(element => {
                            let photo_url = `${URL}/photo?photoreference=${element.photo_reference}&key=${key}&maxwidth=250`;
                            element = {
                                photo_url,
                                ...element
                            };
                            place[i].photos.push(element);
                        });
                    }

                    place[i] = {
                        formatted_phone_number: placeDetails.formatted_phone_number, 
                        address_components: placeDetails.address_components,
                        ...place[i],
                    }
                }
                
                return res.status(200).json(place);
            } catch (error) {
                console.log(error)
                if (error.statusCode == 400) {
                    return res.status(400).json(error.err);
                } else {
                    return res.status(error.statusCode).json({error});
                }
            }
            
        }

        return res.status(400).json({erro: 'Parametros mal formatados'});
    }

}