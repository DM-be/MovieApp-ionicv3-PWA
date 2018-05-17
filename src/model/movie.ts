export class Movie {
    title: string;
    id: number;
    poster: string;
    overview: string;
    poster_path: string;

    constructor(id: number, title: string, overview: string, poster_path?: string, poster?: string, type?: string)
    {
        this.id = id;
        this.title = title;
        if(poster_path)
        {
            this.poster = "https://image.tmdb.org/t/p/w200" + poster_path;
        }
        else {
            this.poster = poster;
        }
        this.overview = overview;
        this.poster_path =  poster_path

    }
}
