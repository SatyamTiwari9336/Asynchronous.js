'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}" >
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
      </article> `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const RenderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////
/*
const getcountry = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    //   console.log(this.responseText);
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `<article class="country">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
      </article> `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getcountry('Bharat');
getcountry('russia');
getcountry('argentina');
getcountry('sudan');
*/

/*
const getcountryAndNeighbour = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    //   console.log(this.responseText);
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    //render country
    renderCountry(data);
    //Get neighbouring Country
    const [neighbour] = data.borders;
    if (!neighbour) return;
    //ajax call 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);
      renderCountry(data2, 'neighbour');
    });
  });
};
getcountryAndNeighbour('russia');
// getcountryAndNeighbour('usa');
///////////////////////////////////////////////
//consuming promises with fetch and throwing custom error and cathcing error
// const getcountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getJSON = function (url, errormsg = ' ') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errormsg} , ${response.status}`);

    return response.json();
  });
};
const getcountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      console.log(data);

      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
       if (!neighbour) throw new Error('No Neighbour found'); //throw new error

      return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(` the error is caused ${err} 💥💥💥`);
      RenderError(
        `some thing went wrong -- ${err.message} -- Try Again ! 💥💥`
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getcountryData('portugal');
  getcountryData('bharat');
  // getcountryData('anijafbub');
});

// getcountryData('jasnfijan'); 404 error not found page
/////////////////////////////////////////////////////////////////
//Challenge - 1
const whereAmI = function (lat, lng) {
  const data5 = fetch(
    'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}'
  ).then(response => response.json());
  console.log(data5);

  const data6 = fetch(
    `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`Problem with geocoding ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}  ,  ${data.countryName}`);
      return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
    })
    .then(response => {
      return response.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(` the error is ${err.message}`));

  console.log(data6);
};
whereAmI(33, 63);
whereAmI(26, 31);
whereAmI(51, 10);
////////////////////////////////////////////
// Event Loop in practice
console.log('test start');
setTimeout(() => {
  console.log('0 second timer');
}, 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));
Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i <= 1000000000; i++) {}
  console.log(res);
});
console.log('test ends');
//output
// test start
// test end
// resolved promise 1
// resolved promise 2
// 0 Second Timer
//as execution context , call stack runs first microtasks queue has priority above callback queue  , at last call back queue  operations .
/////////////////////////////////////
//building a simple Promise
const quicklottery = new Promise((resolve, reject) => {
  console.log('lottery draw is happening ');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You won 💥💥');
    } else {
      reject(new Error('You lost your money 💩'));
    }
  }, 2000);
});

quicklottery.then(res => console.log(res)).catch(err => console.error(err));

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('i waited for 1 second');
    return wait(1);
  })
  .then(() => {
    console.log('i waited for 2 seconds');
    return wait(1);
  })
  .then(() => {
    console.log(' i waited for 3 seconds ');
    return wait(1);
  })
  .then(() => {
    console.log(' i waited for 4 seconds ');
    return wait(1);
  });

Promise.resolve('ABC').then(x => console.log(x));
Promise.reject(new Error('Problem !')).catch(x => console.error(x));
////////////////////////////////////////////////////////
//Promisifying Geolocation API

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => console.error(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
getPosition().then(pos => console.log(pos));

const whereAmI = function (lat, lng) {
  getPosition()
    .then(pos => {
      const { latitutde: lat, longitude: lng } = pos.coords;
      return fetch(
        ` https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
      );
    })
    .then(response => response.json());
  // console.log(data5);

  const data6 = fetch(
    `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`Problem with geocoding ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}  ,  ${data.countryName}`);
      return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
    })
    .then(response => {
      return response.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(` the error is ${err.message}`));

  console.log(data6);
};

btn.addEventListener('click', whereAmI);
////////////////////////////////////////////////////
//challenge -2

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};
const imgcontainer = document.querySelector('.images');
const createImage = function (imgUrl) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.addEventListener('load', function () {
      imgcontainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('image not found'));
    });
  });
};
let currentImage;
createImage('img/img-1.jpg')
  .then(img => {
    currentImage = img;
    console.log('image 1 is loaded');
    return wait(2);
  })
  .then(() => {
    currentImage.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImage = img;
    console.log('image 2 is loaded');
    return wait(2);
  })
  .then(() => {
    currentImage.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImage = img;
    console.log('image 3 is loaded');
    return wait(2);
  })
  .then(() => {
    currentImage.style.display = 'none';
  })
  .catch(err => console.log(err));
*/
////////////////////////////////////////
//async await is syntatic sugar over the .then() method in js
//Async await for consuming promises

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function (country) {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    //reverse Geo coding
    const resGeo = await fetch(
      `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!resGeo.ok) throw new Error('Problem  Getting Location Data');
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    //country data
    // fetch(`https://restcountries.com/v2/name/${country}`).then(res =>
    //   console.log(res)
    // );
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.countryName}`
    );
    if (!res.ok) throw new Error('Problem  Getting Location Data');
    const data = await res.json();
    console.log(data);

    renderCountry(data[0]);
  } catch (err) {
    console.error(`${err} 💥💥`);
    RenderError(`Something went wrong 💥${err.message}`);
  }
};
whereAmI();
console.log('first');
////////////////////////////////////////////////////////
//try catch basic syntax
// try {
//   const x = 3;
//   let y = 3;
//   x = 6;
// } catch (err) {
//   alert(err);
// }
