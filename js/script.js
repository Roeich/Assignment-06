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
    const notFoundBox=document.getElementById("not-found-box");
    notFoundBox.classList.add("hidden");
    petsContainer.classList.add("hidden");
    petsContainer.innerHTML="";
    showLoader();
    if(pets.length>0){
        let innerHtml='<div class="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';
        for(const pet of pets){
            innerHtml+=`
                <div class="card p-4 xl:p-5 border rounded-xl border-gray-100">
                    <figure class="mb-4">
                        <img class="h-40 w-full object-cover rounded-xl" src="${pet.image}" alt="${pet.pet_name}" class="rounded-xl" />
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
                            <button class="btn text-[#0E7A81]" type="button" onclick="addToWishlist(${pet.petId})">
                                <img class="inline-block size-5" src="img/icon-like.svg" alt="like">
                            </button>
                            <button id="adopt-btn-${pet.petId}" class="btn text-[#0E7A81]" type="button" onclick="adoptPet(${pet.petId})">Adopt</button>
                            <button class="btn text-[#0E7A81]" type="button" onclick="petDetails(${pet.petId})">Details</button>
                        </div>
                    </div>
                </div>
            `;
        }
        innerHtml+='</div>'
        petsContainer.innerHTML=innerHtml;

        setTimeout(()=>{
            hideLoader();
            notFoundBox.classList.add("hidden");
            petsContainer.classList.remove("hidden");
        },2000);
    }else{
        setTimeout(()=>{
            hideLoader();
            petsContainer.classList.add("hidden");
            notFoundBox.classList.remove("hidden");
        },2000);
    }
    
}
function showLoader(){
    const petsBox=document.getElementById("loader-box");
    petsBox.classList.remove("hidden");
}
function hideLoader(){
    const petsBox=document.getElementById("loader-box");
    petsBox.classList.add("hidden");
}
loadPets();

// add wishlist
function addToWishlist(petId){
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then((res)=>res.json())
    .then((data)=>showInWishlist(data.petData))
    .catch((err)=>console.log(err));
}
function showInWishlist(pet){
    let wishlistContainer=document.getElementById('wishlist-container');
    
    let item=document.createElement('div');
    item.innerHTML=`<img class="aspect-square object-cover rounded-lg" src="${pet.image}" alt="${pet.pet_name}">`;

    wishlistContainer.append(item);
}

// adopt pet
function adoptPet(petId){
    let countdown=document.getElementById("countdown");
    let countdownFrom=3;
    countdown.innerHTML=countdownFrom;
    let countdownId=setInterval(()=>{
        countdownFrom--;
        if(countdownFrom===0){
            clearInterval(countdownId);
            adoption_modal.close();
            let adoptBtn=document.getElementById(`adopt-btn-${petId}`);
            adoptBtn.innerHTML="Adopted";
            adoptBtn.classList.add("btn-disabled");
            adoptBtn.classList.remove("text-[#0E7A81]");
        }
        countdown.innerHTML=countdownFrom;
    },1000);
    adoption_modal.showModal();
}

// pet details
function petDetails(petId){
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then((res)=>res.json())
    .then((data)=>showPetDetails(data.petData))
    .catch((err)=>console.log(err));
}
function showPetDetails(pet){
    let petDetailsModal=document.getElementById("pet_details_modal");
    petDetailsModal.innerHTML=`
        <div class="modal-box">
            <img class="w-full rounded-lg mb-2" src="${pet.image}" alt="${pet.pet_name}">
            <h3 class="text-2xl font-bold mb-2">${pet.pet_name?pet.pet_name:'Not available'}</h3>
            <div class="mb-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[#13131399]">
                    <div>
                        <img class="inline-block size-4 me-2" src="img/icon-grid.svg" alt="grid">
                        Breed: ${pet.breed?pet.breed:'Not available'}
                    </div>
                    <div>
                        <img class="inline-block size-4 me-2" src="img/icon-calender.svg" alt="calender">
                        Birth: ${pet.date_of_birth?pet.date_of_birth:'Not available'}
                    </div>
                    <div>
                        <img class="inline-block size-4 me-2" src="img/icon-gender.svg" alt="gender">
                        Gender: ${pet.gender?pet.gender:'Not available'}
                    </div>
                    <div>
                        <img class="inline-block size-4 me-2" src="img/icon-dollar.svg" alt="dollar">
                        Price : ${pet.price?pet.price+'$':'Not available'}
                    </div>
                    <div>
                        <img class="inline-block size-4 me-2" src="img/icon-gender.svg" alt="gender">
                        Vaccinated status: ${pet.vaccinated_status?pet.vaccinated_status:'Not available'}
                    </div>
                </div>
            </div>
            <div class="pt-4 pb-5 border-t border-gray-100">
                <h6 class="text-base font-bold mb-2">Details Information</h6>
                <p class="text-[#13131399]">
                    ${pet.pet_details?pet.pet_details:'Not available'}
                </p>
            </div>
            <div>
                <button class="btn w-full" onclick="pet_details_modal.close()">Cancel</button>
            </div>
        </div>
    `;
    pet_details_modal.showModal();
}

// sort pet by price

function sortByPrice(){
    let activeCategory=document.querySelector(".category_btn.active");
    if(activeCategory){
        fetch(`https://openapi.programming-hero.com/api/peddy/category/${activeCategory.innerText.toLowerCase()}`)
        .then((res)=>res.json())
        .then((data)=>displayPets(sortDescending(data.data)))
        .catch((err)=>console.log(err));
    }else{
        fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then((res)=>res.json())
        .then((data)=>displayPets(sortDescending(data.pets)))
        .catch((err)=>console.log(err));
    }
}

function sortDescending(pets){
    if(pets.length>0){
        pets.sort((pet1,pet2)=>{
            let pet1Price=isNaN(parseFloat(pet1.price))?0:parseFloat(pet1.price);
            let pet2Price=isNaN(parseFloat(pet2.price))?0:parseFloat(pet2.price);

            if(pet1Price>pet2Price){
                return -1;
            }else if(pet1Price<pet2Price){
                return 1;
            }else{
                return 0;
            }
        })
    }
    return pets;
}