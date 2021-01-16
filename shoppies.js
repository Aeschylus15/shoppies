

window.addEventListener("load", function() {

  let movieSearchBox = document.getElementById("movie_name");

  let nominatedTitlesArray = []; //array for storing nominated movie title
  let nominatedYearsArray = []; //array for storing nominated movie release year
  let nominatedImdbIdArray = []; //array for storing nominated movie imdb id

  //event listener to fetch movie data from the omdb api as the user types in the search box
  movieSearchBox.addEventListener('input', function(){
    let movieTitle = movieSearchBox.value;
    document.getElementById("search_input").innerHTML = "<h3>Results for &quot"+movieTitle+"&quot</h3>";
    document.getElementById("movie").innerHTML = "";

    fetch("https://www.omdbapi.com/?apikey=2309d7e9&s="+movieTitle)
      .then(response => response.text())
      .then(success)
      .catch(error => console.log('error', error));
  });



  function success(result) {

    let resultJson = JSON.parse(result);
    let searchJson = resultJson.Search;

    //displays a unordered list of movies with nominate button
    for(let i = 0; i<searchJson.length; i++) {
      let title = searchJson[i].Title;
      let year = searchJson[i].Year;
      let imdbId = searchJson[i].imdbID;

      document.getElementById("movie").innerHTML += "<li style='display: inline-block;'>"+title+" ("+year+")</li>&nbsp&nbsp<input type = 'button' id = "+searchJson[i].imdbID+" value='Nominate'> <br><br>";
      if(nominatedImdbIdArray.includes(imdbId)){
        document.getElementById(imdbId).disabled = true;
      }
    }//end for loop

    //adds event handler to each movies' nominate button
    for(let i = 0; i<searchJson.length; i++) {
      let imdbId1 = searchJson[i].imdbID;

      //event handler to fetch movie based on imdbid and display it in nominations section with remove button
      document.getElementById(imdbId1).addEventListener('click', function(){

        //shows an alert if number of nominated movies exceeds the limit which is 5
        if(nominatedImdbIdArray.length < 5) {
          this.disabled = true; // disables the nominate button

          fetch("https://www.omdbapi.com/?apikey=2309d7e9&i="+imdbId1)
            .then(response => response.text())
            .then(success1)
            .catch(error => console.log('error', error));

          //adds the movie title, release year and imdbid to their respective arrays and display them in unordered list with remove button besides each movies
          //calls the 'remove' function once
          function success1(res) {
            let resultJson1 = JSON.parse(res);

            nominatedTitlesArray.push(resultJson1.Title);
            nominatedYearsArray.push(resultJson1.Year);
            nominatedImdbIdArray.push(resultJson1.imdbID);
            document.getElementById("nominations").innerHTML += "<li style='display: inline-block;'>"+resultJson1.Title+" ("+resultJson1.Year+")&nbsp&nbsp<input type = 'button' id='remove_"+resultJson1.imdbID+"' value='Remove'></li> <br><br>";

            remove();
          }
        }
        else {
          alert("You have already selected your 5 nominations");
        }
      });
    }

    //adds event listener to each nominated movie's remove button
    function remove(){
      for(let k = 0; k< nominatedImdbIdArray.length; k++) {

        //removes the movie from the nominations section and enables the nominate button
        document.getElementById('remove_'+nominatedImdbIdArray[k]).addEventListener('click', function(){
          document.getElementById("nominations").innerHTML = "";

          //needs to check if the nominate button is in the current document otherwise throws error
          if(typeof(document.getElementById(nominatedImdbIdArray[k])) != 'undefined' && document.getElementById(nominatedImdbIdArray[k]) != null) {
            document.getElementById(nominatedImdbIdArray[k]).disabled = false;
          }

          //removes the current movie's title, release year and imdbid from their respective arrays
          let index1 = nominatedTitlesArray.indexOf(nominatedTitlesArray[k]);
          if(index1 > -1) {
            nominatedTitlesArray.splice(index1, 1);
          }
          let index2 = nominatedYearsArray.indexOf(nominatedYearsArray[k]);
          if(index2 > -1) {
            nominatedYearsArray.splice(index2, 1);
          }
          let index3 = nominatedImdbIdArray.indexOf(nominatedImdbIdArray[k]);
          if(index3 > -1) {
            nominatedImdbIdArray.splice(index3, 1);
          }

          for(let l = 0; l < nominatedImdbIdArray.length; l++) {
            document.getElementById("nominations").innerHTML += "<li style='display: inline-block;'>"+nominatedTitlesArray[l]+" ("+nominatedYearsArray[l]+")&nbsp&nbsp<input type = 'button' id='remove_"+nominatedImdbIdArray[l]+"' value='Remove'></li> <br><br>";
          }
          remove(); //recursive call to 'remove' function
        });
      }
    }
  }
});
