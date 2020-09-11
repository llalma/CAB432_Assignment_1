//Fetch text of button
const titleFetch = (event) => {
  let title = event.target.value;

  //Clean up title
  title = titleCleanup(title)
  selected_title = title

  fetch(`/edamam/food/${title}?from=0&to=10`,{ redirect: 'follow'})
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

function getSearchQuery(){
  //return the search query from the current url. to pass when changing pages in a search

  var url = window.location.href

  console.log(url)
  var myRegexp = /((?<=search=)(.*)(?=&)|(?<=search=)(.*)(?=$))/g;
  var url = url.match(myRegexp);

  return url
}

function gotoPrevPage(){
  const before = event.target.value

  //get search query
  const q = getSearchQuery()

  //Get url for paging
  let url = `/?${event.target.value}&dir=previous`
  if(q != undefined){
    url += `&search=${q[0]}`
  }

  fetch(url,{ redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.assign(data.url) 
    })
    .catch((error) => console.log(error));
}

function gotoNextPage(){
  const after = event.target.value

  //get search query
  const q = getSearchQuery()

  //Get url for paging
  let url = `/?${event.target.value}&dir=forward`
  if(q != undefined){
    url += `&search=${q[0]}`
  }
  
  fetch(url,{ redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      console.log(data)
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




