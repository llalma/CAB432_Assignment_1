
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

//Food item search box

function getFoodData(item,index){
    var itemName = [];
    var itemNutrientsString = [];

    //Remove just blank lines to be safe.
    if(item != ""){
        fetch(`/nutrition/item/${item}`)
            .then((res) => res.json())
            .then((data) => {
                alert(itemName)
                itemName.push("hi")
                alert(itemName)
                // itemName.push(data.data.food.label);
                // itemNutrientsString.push(data.data.food.nutrients);

                // itemNutrientsString(data.data.food)
                // redirect: window.location.assign(data.url) 
            })
            .catch((error) => console.log(error));
    }

    console.log(itemName);
    // console.log(itemNutrientsString);
}

var item = document.getElementById('foodItemSearch');

item.addEventListener('submit',function(e) {
    e.preventDefault();
    var b = document.getElementById("foodItemtext").value;

    //Split by new lines
    lines = b.split("\n")
    
    lines.forEach(getFoodData)
});


