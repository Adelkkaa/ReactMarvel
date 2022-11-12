import {useHttp} from "../hooks/http.hook";


const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/characters';
    const _apiBaseComics = 'https://gateway.marvel.com:443/v1/public/comics';
    const _apiKey = 'apikey=eba33c0500f7e7e0905be760070b6f99';
    const _baseOffset = 210;


    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res =  await request(`${_apiBase}/${id}?&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBaseComics}?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBaseComics}/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

   const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items 
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getComics, getAllComics, getCharacterByName};
}   



export default useMarvelService;