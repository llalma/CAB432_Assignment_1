
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


//Find nutrients in an item. input is split by newline char
var item = document.getElementById('foodItemSearch');

item.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById("foodItemtext").value;

    //Split by new lines
    lines = b.split("\n")

    //Declare variables
    var items = []
    var itemNutrientsString = []

    //Loop through each item in list and check its not empty
    for(let i = 0;i<lines.length;i++){
        if(lines[i] != ""){

            temp(lines[i])
                .then(data => {
                        items.push(data.data.food.label)
                        itemNutrientsString.push(data.data.food.nutrients)
                    })
                .then(j => {
                    console.log(items)
                    console.log(itemNutrientsString)
                })
        }
    }

    // console.log("printing items array")
    // console.log(items)

    // console.log("printing 0th position of items array")
    // console.log(items[0])


    // document.querySelector('.Results').innerHTML = items[0];

});


