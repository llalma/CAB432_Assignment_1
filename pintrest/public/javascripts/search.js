
//Reddit search box
var a = document.getElementById('tfnewsearch');

a.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById('tftextinput').value;

    if(b === ""){
        window.location.href = 'http://localhost:3000/';
    }else{
        window.location.href = 'http://localhost:3000/search/'+b;
    }
});

async function temp(url) 
{
  let resp = await fetch(`/nutrition/item/${url}`);
  let data = await resp.json()
  return data;
}

async function temp2(lines){
    let label = "";
    let nutrients = "";

    //Create a table for results
    let display = "<table>"

    //Loop through each item in list and check its not empty
    for(let i = 0;i<lines.length;i++){
        if(lines[i] != ""){

            //Get results from api, use await to stop until results are avaliable
            await temp(lines[i])
                .then(data => {
                        label = data.data.food.label
                        nutrients = JSON.stringify(data.data.food.nutrients).replace("{","").replace("}","").split(",")
                    })
                .then(j => {
                    //Add them to the dislay string
                    
                    //New row per food item, pre makes each addition on a new line.
                    display += `<tr><td>${label}</td><td><pre>`

                    //Actually add the nutrients to the cell
                    for(const nut of nutrients){
                        display += nut+"\n"
                    }

                    //Close the row as all nutrients were added
                    display += `</pre></td></tr>`
                })

        }
    }

    //Return display string
    return display
}

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
    temp2(lines)
        .then(display => {
            document.querySelector('.Results').innerHTML += display + `</table>`
        })
});


