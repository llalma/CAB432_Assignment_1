
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


