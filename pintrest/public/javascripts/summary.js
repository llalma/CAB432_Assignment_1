//Fetch text of button
const titleFetch = (event) => {
  let title = event.target.value;

  //Clean up title
  title = titleCleanup(title)
  selected_title = title

  console.log(selected_title)

  fetch(`/edamam/food/${title}`,{ method: 'POST', redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.assign(data.url) 
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

function gotoPrevPage(){
  const before = event.target.value
  console.log(before)

  fetch(`/?${event.target.value}&dir=previous`,{ method: 'POST', redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.assign(data.url) 
    })
    .catch((error) => console.log(error));
}

function gotoNextPage(){
  const after = event.target.value
  console.log(after)

  fetch(`/?${event.target.value}&dir=forward`,{ method: 'POST', redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.assign(data.url) 
    })
    .catch((error) => console.log(error));
}

// Add an event listener to each get recipe button
const recipeButtons = document.getElementsByClassName("getRecipe");

for (let button of recipeButtons) {
  button.addEventListener("click", (event) => titleFetch(event));
}

//Previous page
var prevPage = document.getElementById('prevPage');
if(prevPage != undefined){
  prevPage.addEventListener("click", (event) => gotoPrevPage(event));
}


//Next page
var nextPage = document.getElementById('nextPage');
if(nextPage != undefined){
  nextPage.addEventListener("click", (event) => gotoNextPage(event));
}




