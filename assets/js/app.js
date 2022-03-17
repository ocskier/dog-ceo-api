// Grab references for all persistent elements in the DOM
var breedFormEl = document.querySelector('.breed-form');
var breedInputEl = document.getElementById('breed-input');
var breedContainerEl = document.getElementById('breed-info');
var loading = document.querySelector('.spinner-border');

// Make api call to get all breeds to populate autocomplete input field
fetch('https://dog.ceo/api/breeds/list/all')
  .then((response) => {
    if (response.status < 400) {
      return response.json();
    }
    throw new Error('No breed data Available!');
  })
  .then((data) => {
    $(breedInputEl).autocomplete({
      source: Object.keys(data.message),
    });
  });

// A reusable function to call the Dog CEO api with any breed for pics
function callAPI(breed) {
  // Empty the pic container
  breedContainerEl.innerHTML = '';

  // Hide the breed header and show loading
  loading.previousElementSibling.classList.add('d-none');
  loading.classList.remove('d-none');

  //Call the API with the specific breed
  fetch('https://dog.ceo/api/breed/' + breed + '/images')
    .then(response => {
      if(response.status < 400) {
        // Parse JSON from body of response if successful
        return response.json()
      }
      throw new Error('No breed data Available!')
    })
    .then(data => {
      // Alert successful call
      toast();
      var messages = data.message;

      // Show the breed header
      loading.previousElementSibling.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
      loading.previousElementSibling.classList.remove('d-none');

      // Create an image element for all breed pics
      for (var index = 0; index < messages.length; index++) {
        var picUrl = messages[index];

        var newPetImgEl = document.createElement('img');

        newPetImgEl.setAttribute('class', 'd-block w-100 pet-pic');
        newPetImgEl.src = picUrl;
        newPetImgEl.alt = 'dog-' + index;

        var newPicDivEl = document.createElement('div');
        newPicDivEl.setAttribute('class', 'carousel-item' + `${index === 0 ? ' active' : ''}`);
        newPicDivEl.append(newPetImgEl);
        
        breedContainerEl.append(newPicDivEl);
      }
      // Hide the loading element 
      loading.classList.add('d-none');
    })
    .catch((error) => {
      // Alert the user for any network issues
      console.log(error);
      toast('error');
      setTimeout(function () {
        loading.classList.add('d-none');
      }, 1200);
    });
}

// Listen for breed submission and run the search with the input
breedFormEl.addEventListener('submit', function (e) {
  e.preventDefault();
  var breedVal = breedInputEl.value;
  if (breedVal) {
    callAPI(breedVal);
    breedInputEl.value = '';
  }
});



// This is just for info purposes a cool third-party library
// Ternary expressions (? and :) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
function toast(err) {
  return Toastify({
      text: err ? "Couldn't find data for that breed" : "Here are your dog pics!!",
      duration: 1200,
      close: err ? true : false,
      gravity: 'bottom', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      className: err ? 'custom-error' : 'success',
      stopOnFocus: true, // Prevents dismissing of toast on hover
      // onClick: function () {}, // Callback after click
    }).showToast()
}


// *****************************************************************
//       rewriting with modern async/await promise handling
// *****************************************************************

// async function callAPI(breed) {
//   breedContainerEl.innerHTML = '';
//   var requestUrl = 'https://dog.ceo/api/breed/' + breed + '/images';
//   try {
//     var response = await fetch(requestUrl);
//     var data = await response.json();
//     var messages = data.message;

//     for (var index = 0; index < 50; index++) {
//       var picUrl = messages[index];

//       var newPetImgEl = document.createElement('img');
//       newPetImgEl.setAttribute('class', 'img-thumbnail rounded w-100 mh-100');
//       newPetImgEl.src = picUrl;

//       var newPicDivEl = document.createElement('div');
//       newPicDivEl.setAttribute('class', 'col-8 col-sm-5 col-md-3 pet-pic');
//       newPicDivEl.append(newPetImgEl);
//       breedContainerEl.append(newPicDivEl);
//     }
//     return
//   } catch(err) {
//     console.log(err);
//   };
// }

// breedFormEl.addEventListener('submit', async function (e) {
//   e.preventDefault();
//   var breedVal = breedInputEl.value;
//   if (breedVal) {
//     await callAPI(breedVal);
//     breedInputEl.value = '';
//   }
// });
