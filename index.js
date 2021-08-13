document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar")
    const url = "http://localhost:3000/pups";
    const dogInfoDiv = document.querySelector("#dog-info")
    const goodDogFilter = document.querySelector("#good-dog-filter")
    goodDogFilter = document.querySelector('#click', filterDogs )

    fetchDogs().then(renderDogBar)
    

    function fetchDogs(){ //grabs all the dogs 
        return fetch(url)
        .then(r => r.json())
     //renders the dog bar after fetching dogs using callback function
    }

    function renderDogBar(dogs){  //constructs the dog bar using the dogs
        dogs.forEach(addDogToDogBar) //for each dog adding dog argument to dog bar

    }

    function addDogToDogBar(dog){  //adds dog to dog Bar
        const span = document.createElement("span")  //creating a span
        span.innerText = dog.name //the dog name holds the object so basically just putting the object in each span
        span.setAttribute("data-id", dog.id)
        span.addEventListener("click", showDogInfo) //create event listener for each eleemnt in the bar
        dogBar.append(span)
    }

    function showDogInfo(event){
        const dogId = event.target.dataset.id
        fetch(`http://localhost:3000/pups/${dogId}`)
        .then(response => response.json())
        .then(dog => {
            const goodOrBad = dog.isGood? "Good dog!" : "Bad dog!"
            dogInfoDiv.innerHTML = `<img src="${dog.image}>
           <h2>${dog.name}</h2>
           <button data-id=${dog.id}>${goodOrBad}</button>`
            const button = dogInfoDiv.querySelector("button")
            button.addEventListener("click", toggleDog)
        })
    }

    function toggleDog(event){
        //change the status of the dog to good to bad or bad to good
        const goodOrBad = event.target.innerText.slicee(0, 1)
        const isGoodDog = goodOrBad == "Good" ? true :false
        const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
        const dogId = event.target.dataset.id
        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            body: JSON.stringify({isGoodDog: !isGoodDog}),
            headers: {"CONTENT-TYPE": "application/json"}
        })
        .then(res => res.json())
        event.target.innerText = newStatus

    }

    function filterDogs (event) {
        dogBar.innerHTML = ""
        const onOrOff = event.target.innerText.split(":")[1]
        if (onOrOff === "OFF"){
            event.target.innerText = "Filter  good dogs: ON"
            fetchDogs()
            .then(dogs => dogs.filter(dog => dog.isGoodDog))
            .then(goodDogs => renderDogBar(goodDogs))
        } else {
            event.target.innerText = "Filter  good dogs: OFF"
            fetchDogs().then(renderDogBar)
        }
    }
})