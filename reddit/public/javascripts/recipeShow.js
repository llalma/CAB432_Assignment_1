
const recipeShow = (event) => {
    //Get the clicked on recipe and get the specific details for the recipes.

    //URI of recipe is saved in button text. Get it out and encode to be places in URL routing.
    let temp = event.target.value;
    temp = temp.split(",")
    uri = encodeURIComponent(temp[1])

    //Fetch the details about the recipe from the router. In this form as request needs to be async, to ensure html is filled out correctly.
    fetch(`${temp[0]}?selected=${uri}`)
        .then((res) => res.json())
        .then((data) => {
            //Fill HTML data with the results from the router.
            fillHTML(data.label,data.ingredients,data.calories,data.url,data.totalNutrients)
                .then(htmlString =>{
                    document.querySelector('.selectedRecipe').innerHTML = htmlString;
                })
        })
        .catch((error) => console.log(error));

    //Make all button td boxes white, so no duplicated yellow boxes
    const buttonBoxes = document.getElementsByClassName("buttonBox");
    for (let button of buttonBoxes) {
        button.style.backgroundColor = "white";

    }

    //Make selected item highlighted
    boxSelected = event.target.parentNode
    boxSelected.style.backgroundColor = "yellow";
}

function afterIngredientsHTML(calories,url,totalNutrients){
    //Returns the html text after the ingredients have been added. Made it its own function as previous function is messy enough already.

    var htmlString = ""

    htmlString += `
    </td>
        </tr>
        <tr class="border_bottom">
            <td><h2>Calories</h2></td>
            <td>
                ${calories} kcal
            </td>
        </tr>
        <tr class="border_bottom">
            <td><h2>Steps</h2></td>
            <td><a href=${url}>${url}</a></td>
        </tr>
        <tr class="border_bottom">
            <td><h2>Nutrients</h2></td>
            <td>
                <table>`

    //Nutrients
    for(var key in totalNutrients){
        htmlString += ` <tr>
                    <td>
                        <h3>${totalNutrients[key].label}</h3>
                    </td>
                    <td>
                        ${totalNutrients[key].quantity} ${totalNutrients[key].unit}
                    </td>
                    </tr>`
    }

    htmlString += `    </table>
                </td>
            </tr>
        </table>`

    return htmlString
}

async function fillHTML(title,ingredients,calories,url,totalNutrients){
    //Fills out the required html string to paste directly into the old html

    var htmlString = `
    <table>
        <tr class="border_bottom">
            <td class="border_bottom">
                <h2> Title </h2>
            </td>
            <td>
                ${title}
            </td>
        </tr>
        <tr class="border_bottom">
            <td><h2>Ingredients</h2></td>
            <td>`

    //Get the html string for the ingredients, this part needs to be async.
    await getHTMLstr(ingredients)
        .then(display => {
            htmlString += display + `</table>`

            htmlString += afterIngredientsHTML(calories,url,totalNutrients)
            
        })
        .catch((error) => {
            //If any of the ingredient require some form of lanuage processing to get the nurtients of the data from the text jsut display the food items instead. 

            console.log(error)
            htmlString += "Unable to show nutrients due to how api returns data. Need a higher level liscense to return ingredients as an ingredient object as listed on the api. Can look in console for how the json currently looks for an ingredient."

            //Just display ingredients without nutrients
            htmlString += "<table>"
            for(let i=0;i<ingredients.length;i++){
                htmlString += ` <tr>
                    <td>
                         ${ingredients[i].text}
                    </td>
                </tr>`
            }
            htmlString += "</table>"


            htmlString += afterIngredientsHTML(calories,url,totalNutrients)
                
        });
    return htmlString   
}

async function getNutritions(url) 
{
  let resp = await fetch(`/nutrition/item/${url}`);
  let data = await resp.json()
  return data;
}

async function getHTMLstr(lines){
    //Async function for passing the ingredients from the recipe to the Edamam food database to return the nutrioents of each food item in the format required by the html.

    let label = "";
    let nutrients = "";

    //Create a table for results
    let display = "<table>"

    //Loop through each item in list and check its not empty
    for(let i = 0;i<lines.length;i++){
        if(lines[i] != ""){

            const words = lines[i].text.split(" ")
            

            //Get results from api, use await to stop until results are avaliable
            await getNutritions(lines[i].text)
                .then(data => {
                        label = data.data.food.label
                        nutrients = JSON.stringify(data.data.food.nutrients)
                    })
                .then(j => {
                    //Add them to the dislay string
                    
                    //New row per food item, pre makes each addition on a new line.
                    display += `<tr><td>${label}</td><td><pre>`

                    //Actually add the nutrients to the cell
                    var obj = JSON.parse(nutrients);

                    //If the first word in the string is a number, treat it as a multiplyer.
                    if(parseInt(words[0]) != NaN){
                        for (var key in obj) {
                            display += `${key}: ${obj[key]*parseInt(words[0])}\n`
                        }
                    }else{
                        //Just display the nutrients of the food item.
                        for (var key in obj) {
                            display += `${key}: ${obj[key]}\n`
                        }
                    }

                    //Close the row as all nutrients were added
                    display += `</pre></td></tr>`
                })

        }
    }

    //Return display string
    return display
}

function getSearchQuery(){
    //return the search query from the current url. to pass when changing pages in a search
  
    var url = window.location.href
  
    var myRegexp = /(?<=food\/)(.*)(?=\?from)/g;
    var url = url.match(myRegexp);
  
    return url
  }

function gotoPrevPage(event){
    //Go to previous page

    const before = event.target.value
  
  
    //Get url for paging
    let url = `?${event.target.value}`
    //get search query
    const q = getSearchQuery()
  
    //Fetch results from router for previous page
    fetch(`/edamam/food/${q}${url}`,{ redirect: 'follow'})
      //Redirect to list of recipes
      .then((data) => {
        redirect: window.location.assign(data.url) 
      })
      .catch((error) => console.log(error));
  }
  
function gotoNextPage(event){
    //Go to the next page

    const after = event.target.value
  
    //Get url for paging
    let url = `?${event.target.value}`

    //get search query
    const q = getSearchQuery()

    //Fetch results from router for the next page    
    fetch(`/edamam/food/${q}${url}`,{ redirect: 'follow'})
      //Redirect to list of recipes
      .then((data) => {
        redirect: window.location.assign(data.url) 
      })
      .catch((error) => console.log(error));
}

// Add an event listener to each recipe title
const avaliableRecipes = document.getElementsByClassName("recipeTitle");
for (let button of avaliableRecipes) {
  button.addEventListener("click", (event) => recipeShow(event));
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


