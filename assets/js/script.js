let app = new Vue({
    el:"#root",
    data:{

        initValue: '',
        movieList:[],

    },
    methods: {

        searchMovie : function (){

            axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=ddf88c3ce2b6d4e123fdc23f9bae3d52&language=en-US&&query=${this.initValue}&page=1&include_adult=false`
            ).then(response=>{
                console.log(response.data.results);
                this.movieList = response.data.results;
               
                this.movieList.forEach(element => {
                    // console.log(element.vote_average);
                    let vote = Math.round(element.vote_average/2);
                    // console.log(vote);
                    element.vote_average = vote;
                    element.max_vote = 5;
                   
                });


            })
            ;

        }


    },
    mounted() {
        


    },
})

// titolo titolo originale lingua voto