let app = new Vue({
  el: "#root",
  data: {
    initValue: "",
    searchList: [],
    imageUrl: "https://image.tmdb.org/t/p/w342",
    castListName: [],
    genreMovie: [],
    genreTvShow: [],
    genre: ['All'],
  },
  methods: {
    searchAll: function () {

      //Get all Movies

      axios
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US&&query=${this.initValue}&page=1&include_adult=false`
        )
        .then((response) => {
          // Milestone 1,2 (add stars to show the vote_average)

          // I bind to our searchList the response from the database.

          this.searchList = response.data.results;
          // console.log(response.data.results);

          // To each element of our searchList i create a variable vote which i bind the value with math.ceil method
          this.searchList.forEach((element) => {
            element.type = "Movie";
            let vote = Math.ceil(element.vote_average / 2);
            element.vote_average = vote;
            // Creating a property to every of our object to be able to have a maximum of stars
            element.max_vote = 5;

            // Milestone 3
            // i create a variable to assign the value of poster_path property, then i assign to the element.poster_path the value of the standardize imageUrl + the element.poster_path value

            let coverImg = element.poster_path;
            element.poster_path = `${this.imageUrl}${coverImg}`;

            // MILESTONE 5 ADD ACTORS AND GENRE

            // We request the whole cast by element id, then we create a new object cast to store the data of the first 5 actors name.then we need to use the Vue.set property to be able to add the object to an element property that we call 'actors'

            axios
              .get(
                `https://api.themoviedb.org/3/movie/${element.id}/credits?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US`
              )
              .then((response) => {
                let cast = {};

                // console.log(response.data.cast);
                let actorMovieName = response.data.cast.slice(0, 5);

                for (let i = 0; i < actorMovieName.length; i++) {
                  // console.log(actorMovieName[i].name);
                  Vue.set(cast, i, actorMovieName[i].name);
                }

                //  console.log(cast);
                Vue.set(element, "actors", cast);
              });
            // console.log(this.searchList);
            // let searchListParsed = JSON.parse(JSON.stringify(this.searchList));
            // console.log(searchListParsed);
            // console.log(element);
            // console.log(element.genre_ids);

            let genreNames = [];

            for (let v = 0; v < this.genreMovie.length; v++) {
              //  console.log(this.genreMovie[v].name);
              //  console.log(this.genreMovie[v].id);

              for (let u = 0; u < element.genre_ids.length; u++) {
                //  console.log(element.genre_ids[u]);
                if (element.genre_ids[u] == this.genreMovie[v].id) {
                  //  console.log(element.genre_ids[u]);

                  //QUESTO LOG SOTTO E' IL NOME DEI GENERI CHE CORRISPONDONO NELLA LISTA DI TUTTI I GENERI

                  //QUESTO VALORE SARA' IL VALORE CHE DEVO STAMPARE SOTTO FORMA DI PROPRIETA' GENERE1, GENERE2 al nostro element!!!
                  // console.log(this.genreMovie[v].name);
                  let genreName = this.genreMovie[v].name;

                  genreNames.push(genreName);

                  console.log(genreName);
                }
                Vue.set(element, "genre", genreNames);
              }
            }

            console.log(element);
          });
        });

      // /Movie

      //TvShow

      // Milestone 2 (add tv shows to the list)
      axios
        .get(
          `https://api.themoviedb.org/3/search/tv?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=it_IT&query=${this.initValue}`
        )
        .then((response) => {
          //   console.log(response.data.results);
          let tvShows = response.data.results;

          // console.log(tvShows);
          tvShows.forEach((element) => {
            // Milestone 3
            // i create a variable to assign the value of poster_path property, then i assign to the element.poster_path the value of the standardize imageUrl + the element.poster_path value

            let coverImg = element.poster_path;
            element.poster_path = `${this.imageUrl}${coverImg}`;

            // console.log(element);

            // Milestone 5
            // We request the whole cast by element id, then we create a new object cast to store the data of the first 5 actors name.then we need to use the Vue.set property to be able to add the object to an element property that we call 'actors'

            let tvShowCast = {};

            axios
              .get(
                `https://api.themoviedb.org/3/tv/${element.id}/credits?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US`
              )
              .then((response) => {
                // console.log(response.data.cast);

                let actorTvShowName = response.data.cast.slice(0, 5);
                // console.log(actorTvShowName);

                for (let i = 0; i < actorTvShowName.length; i++) {
                  // console.log(actorTvShowName[i].name);
                  Vue.set(tvShowCast, i, actorTvShowName[i].name);
                }

                //  console.log(tvShowCast);
              });

            let genreTvShowNames = [];

            for (let i = 0; i < this.genreTvShow.length; i++) {
              for (let p = 0; p < element.genre_ids.length; p++) {
                if (element.genre_ids[p] == this.genreTvShow[i].id) {
                  // console.log(element.genre_ids);
                  // console.log(this.genreTvShow[i].name);

                  let genreTvShowName = this.genreTvShow[i].name;
                  genreTvShowNames.push(genreTvShowName);
                }
              }
            }

            console.log(element);
            // console.log(genreTvShowNames);
            Vue.set(element, "genre", genreTvShowNames);

            // console.log(element);
            //Push new objects into the array, not to get the error i need already to push them with the standard proprierties of searchList[], otherway it reminds as that the array length has some error

            // console.log(element);
            this.searchList.push({
              title: element.name,
              genre: element.genre,
              genre_ids: element.genre_ids,
              original_title: element.original_name,
              original_language: element.original_language,
              type: "Tv show",
              overview: element.overview,
              poster_path: element.poster_path,
              vote_average: Math.ceil(element.vote_average / 2),
              max_vote: 5,
              actors: tvShowCast,
            });
          });

          //   console.log(this.searchList);
        });

      // /TvShow
      console.log(this.searchList);
      // console.log(this.searchList);
      this.initValue = '';
    },

  },

  created() {
    // GenreMovie list of all genres
    axios
      .get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US`
      )
      .then((response) => {
        // console.log(response.data.genres);
        this.genreMovie = response.data.genres;
        this.genreMovie.forEach((element) => {
          this.genre.push(element.name);
        });

        // console.log(this.genreMovie);
      });
    // /GenreMovie

    //TvSerieGenre
    axios
      .get(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US`
      )
      .then((response) => {
        // console.log(response.data.genres);
        this.genreTvShow = response.data.genres;

        this.genreTvShow.forEach((element) => {
          this.genre.push(element.name);
        });
      });
    // /TvSerieGenre
  },
  
   


});