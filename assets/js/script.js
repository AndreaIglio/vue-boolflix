let app = new Vue({
  el: "#root",
  data: {
    initValue: "",
    searchList: [],
    imageUrl: "https://image.tmdb.org/t/p/w342",
    castListName: [],
  },
  methods: {
    searchMovie: function () {
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
            
            // Milestone 5
            
            axios
              .get(
                `https://api.themoviedb.org/3/movie/${element.id}/credits?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US`)
              .then((response) => {
                // console.log(response.data.cast);
                let castListName = response.data.cast.slice(0,5);
                console.log(castListName);
                console.log(this.searchList);

                let namesActorList = [];

                castListName.forEach(element=> {
                  namesActorList.push(element.name)
                })

                console.log(namesActorList);

          
                 this.searchList.forEach((element) => {
                 element.actor1 = namesActorList[0];
                 element.actor2 = namesActorList[1];
                 element.actor3 = namesActorList[2];
                 element.actor4 = namesActorList[3];
                 element.actor5 = namesActorList[4];
                
                });
                

                  console.log(this.searchList);

              
              });


          });
          //   console.log(this.searchList);
        });

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
            //Push new objects into the array, not to get the error i need already to push them with the standard proprierties of searchList[], otherway it reminds as that the array length has some error

           

            console.log(element);
            this.searchList.push({
              title: element.name,
              original_title: element.original_name,
              original_language: element.original_language,
              type: "Tv show",
              poster_path: element.poster_path,
              vote_average: Math.ceil(element.vote_average / 2),
              max_vote: 5,
            });
          });

          //   console.log(this.searchList);
        });
    },
  },
});