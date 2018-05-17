export class Movie {
    title: string;
    id: number;
    poster: string;
    overview: string;
    image_url: string = "https://image.tmdb.org/t/p/w200"
    poster_path: string;

    constructor(id: number, title: string, poster_path: string, overview: string )
    {
        this.id = id;
        this.title = title;
        this.poster = this.image_url + poster_path
        this.overview = overview;
        this.poster_path =  poster_path

    }
}
