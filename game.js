let button = document.getElementById("button");
let images = document.getElementById("images");
let titles = document.getElementById("titles");
let questionClickDiv = document.getElementById("questionClickDiv");
let answersTable = document.getElementById("answersTable");

async function firstTry() {
  images.innerHTML = "";
  titles.innerHTML = "";

  let array = [];

  const data = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f7b90963eamshf47dc9bcd5e7ff5p1b0d21jsna5168b2db105",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
  };
  try {
    let response = await fetch(
      "https://imdb8.p.rapidapi.com/title/get-top-rated-movies",
      data
    );
    //console.log(response);
    if (response.ok) {
      const jsonResponse = await response.json();
      //console.log(jsonResponse);
      jsonResponse.forEach((element) => {
        const newValue = element.id.split("/");
        array.push(newValue[2]);
      });
      return listMovies(array);
    } else {
      throw new Error("error");
    }
  } catch (err) {
    console.log(err);
  }

  console.log(array);
}

button.onclick = () => firstTry();

const listMovies = (param) => {
  let selections = [];
  let numbers = [];
  let count = 0;
  // questionClickDiv.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    let random = Math.floor(Math.random() * param.length);
    if (numbers.includes(random)) {
      count++;
    } else {
      numbers.push(random);
    }
  }

  // console.log(numbers)

  numbers.forEach((i) => {
    const oneQuestion = param[i];
    selections.push(oneQuestion);
  });

  // console.log(selections)

  imagesFunc(selections);
};

async function imagesFunc(param) {
  //console.log(event.target.parentElement.id);
  images.innerHTML = "";
  titles.innerHTML = "";
  let wrongOptions = [];

  let randomPick = Math.floor(Math.random() * param.length);

  for (let i = 0; i < param.length; i++) {
    if (param[i] !== param[randomPick]) {
      wrongOptions.push(param[i]);
    }
  }

  //console.log(param[randomPick]);
  //console.log(wrongOptions);

  const data = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f7b90963eamshf47dc9bcd5e7ff5p1b0d21jsna5168b2db105",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
  };

  try {
    let response = await fetch(
      `https://imdb8.p.rapidapi.com/title/get-images?tconst=${param[randomPick]}&limit=25`,
      data
    );
    // console.log(response);
    if (response.ok) {
      const jsonResponse = await response.json();
      const titlePath = jsonResponse.images[0];
      console.log(titlePath.relatedTitles[0].title);
      let questionHead = document.createElement("h3");
      questionHead.innerHTML =
        "Which movie do you think these scenes are from...";
      images.appendChild(questionHead);

      for (let i = 0; i < 9; i++) {
        let photo = document.createElement("img");
        photo.src = jsonResponse.images[i].url;
        // photo.id = param[randomPick];
        images.appendChild(photo);
      }
    } else {
      throw new Error("error");
    }
  } catch (err) {
    console.log(err);
  }

  options(param, param[randomPick]);
}

function options(param, correctTitle) {
  console.log(param);

  for (let i = 0; i < param.length; i++) {
    fetch(
      `https://imdb8.p.rapidapi.com/title/get-images?tconst=${param[i]}&limit=25`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "f7b90963eamshf47dc9bcd5e7ff5p1b0d21jsna5168b2db105",
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request failed!");
      })
      .then((jsonResponse) => {
        const titlePath = jsonResponse.images[0];
        console.log(titlePath.relatedTitles[0].title);
        let answer = document.createElement("td");
        answer.innerHTML = titlePath.relatedTitles[0].title;
        answer.classList.add("answer");
        answer.id = param[i];
        answer.addEventListener("click", function (e) {
          if (e.target.id === correctTitle) {
            console.log(e);
            let correctAnswer = document.getElementById(e.target.id);
            console.log(correctAnswer);
            correctAnswer.style.backgroundColor = "yellowgreen";
          } else {
          }
        });
        answersTable.appendChild(answer);
      })
      .catch((err) => console.log(err));
  }
}

//function questionResult() {}
