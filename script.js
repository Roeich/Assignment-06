// load category dynamically
function loadCategories(){
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
    .then((res)=>res.json())
    .then((data)=>displayCategories(data.categories))
    .catch((err)=>console.log(err));
}
function displayCategories(categories){
    const categoriesContainer=document.getElementById("categories-container");

    let innerHtml='';
    for(const category of categories){
        innerHtml+=`
            <button id="category_${category.category}" class="btn h-12 xl:h-20 text-xl xl:text-2xl category_btn" type="button" onclick="loadPetsByCategory('${category.category}')"><img class="size-8 xl:size-10" src="${category.category_icon}" alt="${category.category}"> ${category.category}</button>
        `;
    }
    categoriesContainer.innerHTML=innerHtml;
}
loadCategories();

// load pet list 
function loadPets(){
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then((res)=>res.json())
    .then((data)=>displayPets(data.pets))
    .catch((err)=>console.log(err));
}
function loadPetsByCategory(category){
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category.toLowerCase()}`)
    .then((res)=>res.json())
    .then((data)=>displayPets(data.data))
    .catch((err)=>console.log(err));

    document.querySelectorAll(".category_btn").forEach((btn)=>{
        btn.classList.remove("active");
    });
    document.getElementById(`category_${category}`).classList.add("active");
    
}
function displayPets(pets){
    const petsContainer=document.getElementById("pets-container");
    const notFoundCcontainer=document.getElementById("not-found-container");
    petsContainer.innerHTML="";
    if(pets.length>0){
        let innerHtml='<div class="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';
        for(const pet of pets){
            innerHtml+=`
                <div class="card p-4 xl:p-5 border rounded-xl border-gray-100">
                    <figure class="mb-4">
                        <img class="h-40 w-full object-cover rounded-xl" src="${pet.image}" alt="Shoes" class="rounded-xl" />
                    </figure>
                    <div class="card-body p-0">
                        <h3 class="text-xl font-bold mb-2">${pet.pet_name?pet.pet_name:'Not available'}</h3>
                        <div class="text-[#13131399]">
                            <div class="mb-1">
                                <img class="inline-block size-4 me-2" src="img/icon-grid.svg" alt="grid">
                                Breed: ${pet.breed?pet.breed:'Not available'}
                            </div>
                            <div class="mb-1">
                                <img class="inline-block size-4 me-2" src="img/icon-calender.svg" alt="calender">
                                Birth: ${pet.date_of_birth?pet.date_of_birth:'Not available'}
                            </div>
                            <div class="mb-1">
                                <img class="inline-block size-4 me-2" src="img/icon-gender.svg" alt="gender">
                                Gender: ${pet.gender?pet.gender:'Not available'}
                            </div>
                            <div class="mb-1">
                                <img class="inline-block size-4 me-2" src="img/icon-dollar.svg" alt="dollar">
                                Price : ${pet.price?pet.price+'$':'Not available'}
                            </div>
                        </div>
                        <div class="card-actions flex justify-between gap-2 border-t border-t-gray-100 pt-4">
                            <button class="btn text-[#0E7A81]" type="button" onclick="addWishlist(${pet.petId})">
                                <img class="inline-block size-5" src="img/icon-like.svg" alt="like">
                            </button>
                            <button class="btn text-[#0E7A81]" type="button" onclick="adoptPet(${pet.petId})">Adopt</button>
                            <button class="btn text-[#0E7A81]" type="button" onclick="petDetails(${pet.petId})">Details</button>
                        </div>
                    </div>
                </div>
            `;
        }
        innerHtml+='</div>'
        petsContainer.innerHTML=innerHtml;

        notFoundCcontainer.classList.add("hidden");
        petsContainer.classList.remove("hidden");
    }else{
        petsContainer.classList.add("hidden");
        notFoundCcontainer.classList.remove("hidden");
    }
}
loadPets();