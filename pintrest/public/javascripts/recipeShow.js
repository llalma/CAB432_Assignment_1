// Add an event listener to each recipe title
const avaliableRecipes = document.getElementsByClassName("recipeTitle");

for (let button of avaliableRecipes) {
  button.addEventListener("click", (event) => recipeShow(event));
}

const recipeShow = (event) => {
    let temp = event.target.value;
    temp = temp.split(",")
    uri = encodeURIComponent(temp[1])

    fetch(`${temp[0]}?selected=${uri}`)
        .then((res) => res.json())
        .then((data) => {
            htmlString = fillHTML(data.label,data.ingredients,data.calories,data.calories,data.totalNutrients)

            document.querySelector('.selectedRecipe').innerHTML = htmlString;
        })
        .catch((error) => console.log(error));
}


function fillHTML(title,ingredients,calories,url,totalNutrients){
    //Fills out the required html string to paste directly into the old html

    var str = `
    <table>
        <tr>
            <td>
                <h2> Title </h2>
            </td>
            <td>
                ${title}
            </td>
        </tr>
        <tr>
            <th><h2>Ingredients</h2></th>
            <th>
            <table>`

    //Ingreadients
    for(let i=0;i<ingredients.length;i++){
        str += ` <tr>
            <td>
                 ${ingredients[i].text}
            </td>
            <td>
                 Nutrion for food item
            </td>
        </tr>`
    }
    
    str += `
    </table>
        </th>
            </tr>
            <tr>
                <th><h2>Calories</h2></th>
                <th>
                    ${calories} kcal
                </th>
            </tr>
            <tr>
                <th><h2>Steps</h2></th>
                <th><a href=${url}>${url}</a></th>
            </tr>
            <tr>
                <th><h2>Nutrients</h2></th>
                <th>
                    <table>`

    //Nutrients
    
    for(var key in totalNutrients){
        str += ` <tr>
                    <th>
                         <h3>${totalNutrients[key].label}</h3>
                    </th>
                    <th>
                         ${totalNutrients[key].quantity} ${totalNutrients[key].unit}
                    </th>
                    </tr>`
    }

    str += `    </table>
                </th>
            </tr>
        </table>`

    return str
}
