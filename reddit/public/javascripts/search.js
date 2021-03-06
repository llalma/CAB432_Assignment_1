async function getNutrients(url) 
{
  let resp = await fetch(`/nutrition/item/${url}`);
  let data = await resp.json()
  return data;
}

async function ingredientsSearch(lines){
    let label = "";
    let nutrients = "";

    //Create a table for results
    let display = "<table>"

    //Loop through each item in list and check its not empty
    for(let i = 0;i<lines.length;i++){
        if(lines[i] != ""){

            //Remove all non alpha numberic chars
            //Split into words per line. Used to see if "2 flour" is specified vs just "flour"
            const words =  lines[i].replace(/\W /g, '').split(" ");

            if(words.length == 2){
                //In form of "2 egg"
                display += await item2HTML(lines[i],words[0])
            }else{
                //In form of egg. Just return general size
                display += await item2HTML(lines[i],1)
            }
        }
    }

    //Close table of results
    display += '</table>'

    //Return display string
    return display
}

async function item2HTML(item,multiply){
    //Requests the item and adds to html in the correct location. Returns almso completed HTML.

    let display = ""
    //Get results from api, use await to stop until results are avaliable
    await getNutrients(item)
    .then(data => {
            label = data.data.food.label
            nutrients = JSON.stringify(data.data.food.nutrients)
        })
    .then(j => {
        //Add them to the dislay string
        
        //New row per food item, pre makes each addition on a new line.
        display += `<tr class="border_bottom"><td>${multiply} ${label}</td><td><pre>`

        //Actually add the nutrients to the cell
        var obj = JSON.parse(nutrients);
        for (var key in obj) {
            display += `${key}: ${obj[key]*multiply}\n`
        }

        //Close the row as all nutrients were added
        display += `</pre></td></tr>`
    })
    .catch((error) => {
        display += `<tr class="border_bottom"><td>${item} does not exist</td><td></td> </tr>`
        console.log(error)
    });

    return display
}

function home(){
    //Redirect to home page. cant use localhost as it is not local host when hosted.
    
    const temp = window.location.href.split("/")[2];

    //localhost, not https certified
    window.location.href = "http://" + temp;
}

//Reddit search box
var a = document.getElementById('tfnewsearch');
a.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById('tftextinput').value.replace(/\W/g, '');

    if(b === ""){
        home();
    }else{
        fetch(`/?search=${b}`,{ redirect: 'follow'})
        //Redirects to search terms
        .then((data) => {
            redirect: window.location.assign(data.url) 
        })
        .catch((error) => console.log(error));
    }
});

//Find nutrients in an item. input is split by newline char
var item = document.getElementById('foodItemSearch');
item.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById("foodItemtext").value;

    //Clear current results if there are any
    document.querySelector('.Results').innerHTML = ""

    //Split by new lines
    lines = b.split("\n")

    //Get results from server. have to use async method to ensure the data is avaliable before attempting to display
    ingredientsSearch(lines)
        .then(display => {
            document.querySelector('.Results').innerHTML += display + `</table>`
        })
});

//Recipe search
var a = document.getElementById('recipeSearch');
a.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById('recipeInput').value.replace(/\W/g, '');

    fetch(`/edamam/food/${b}?from=0&to=10`,{ redirect: 'follow'})
    //Redirect to list of recipes
    .then((data) => {
      redirect: window.location.assign(data.url) 
    })
    .catch((error) => console.log(error));
});


