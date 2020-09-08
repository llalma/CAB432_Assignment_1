//Fetch text of button
const titleFetch = (event) => {
  let title = event.target.value;

  //Clean up title
  title = titleCleanup(title)
  selected_title = title

  console.log(selected_title)

  fetch(`/edamam/food/${title}/0`,{ method: 'POST', redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.replace(data.url) 
    })
    .catch((error) => console.log(error));
};


function titleCleanup(title){
  //Use Regex to remove all chars between [ and ]
  title = title.replace(/\[.*]/, '')

  title = title.replace(".", '')
  title = title.replace(",", '')

  return title
}

// Add an event listener to each get recipe button
const recipeButtons = document.getElementsByClassName("getRecipe");

for (let button of recipeButtons) {
  button.addEventListener("click", (event) => titleFetch(event));
}

// // Add an event listener to each recipe title
// const recipeTitles = document.getElementsByClassName("recipeTitle");

// for (let recipe of recipeTitles) {
//   recipe.addEventListener("click", (event) => recipeFetch(event));
// }
