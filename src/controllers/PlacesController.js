const Places = require('../models/Places');

key = 'AIzaSyDb0sBeGCM22PxWVKeGzJH8UKXRrgpgosw';
URL = 'https://maps.googleapis.com/maps/api/place';

module.exports = {

    async searchPlace(req, res) {

        const text = req.query.text;

        //formata os textos retirando os caracteres com acentuação
        //EX: São Paulo ===> Sao Paulo
        let formattdText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (req.query.text) {
            try {
                let place = await Places.findPlace(key, URL, formattdText);
 
                if( place.lenth !== 0 ) {
                    const cont = place.length;

                    for (let index = 0; index < cont; index++) {
                        let placeElement = place[index];

                        let placeDetails = await Places.findPlaceDetails(key, URL, placeElement.place_id);

                        // adicionando campo de fotos a place
                        placeElement.photos = [];
    
                        //verificar se os detalhes tem fotos
                        if (placeDetails.photos) {
                            // se tiver cria um novo campo com acesso a url da foto
                            placeDetails.photos.forEach(element => {
                                let photo_url = `${URL}/photo?photoreference=${element.photo_reference}&key=${key}&maxwidth=1920`;
                                element = {
                                    photo_url,
                                    ...element
                                };
                                placeElement.photos.push(element);
                            });
                        }
    
                        //adiciona os novos dados para place
                        place[index] = {
                            formatted_phone_number: placeDetails.formatted_phone_number, 
                            address_components: placeDetails.address_components,
                            ...placeElement,
                        };
                    }

                    // Se pace estiver dador retrona ele 
                    return res.status(200).json(place);

                }

                // se não tiver dados retorna erro no paramentros
                return res.status(400).json({erro: 'Parametros mal formatados'});
                
            } catch (error) {
                if (error.statusCode == 400) {
                    return res.status(400).json(error.err);
                } else {
                    return res.status(error.statusCode).json({error});
                }
            }
            
        }        

    }

}