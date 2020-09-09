
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

            //Promise makes code halt until a value is returned. If not here program would executre the logging whilst waiting for results from the fetch.
            Promise.all([lines[i]].map(url =>
                fetch(`/nutrition/item/${url}`).then(resp => resp.json())
            )).then(data => {
                items.push(data[0].data.food.label)
                itemNutrientsString.push(data[0].data.food.nutrients)
            })
        }
    }

    console.log("printing items array")
    console.log(items)

    console.log("printing 0th position of items array")
    console.log(items[0])


    document.querySelector('.Results').innerHTML = items[0];

    // console.log(items)
    // console.log(itemNutrientsString)
});


