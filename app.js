const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  category = document.getElementById("mealCategory"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");
categories = document.getElementById("categories");
category_desc = document.getElementById("category");
searchCategory = document.getElementById("search_category");
categorySearchBtn = document.getElementById("category-search-btn");

function searchMeal(e) {
  e.preventDefault();

  //Clear singlemeal
  single_mealEl.innerHTML = "";

  //get search term

  const term = search.value;
  //check for empty input
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                   <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}</h3></div>
            </div>
           `
            )
            .join("");
        }
      });
    //clear search text
    search.value = "";
  } else {
    alert("Please enter a search value");
  }
}

function searchMealByCategory(e) {
  e.preventDefault();
  single_mealEl.innerHTML = "";

  const term = searchCategory.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;
        } else {
          category_desc.innerHTML = data.meals
            .map(
              (meal) => `
                   <div class="meals-category">
                   <h3 class="meal-title">${meal.strMeal}</h3></div>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        
            </div>
           `
            )
            .join("");
        }
      });
    //clear search text
    searchCategory.value = "";
  } else {
    alert("Please enter a search value");
  }
}

//Fetch meal detail by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealtoDOM(meal);
    });
}

function getrandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealtoDOM(meal);
    });
}

function getMealCategory() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      categories.innerHTML = `<h2>Meal Categories :</h2>`;
      category_desc.innerHTML = data.categories.map(
        (category) => `
                   <div class="category">
                   <div class="category-name"><h3>${category.idCategory} : ${category.strCategory}</h3>
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" />
            <p> ${category.strCategoryDescription}</p>
                  </div>
            </div>
           `
      );
    });
}

function addMealtoDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
<div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
</div>
<div class="main">
<p>${meal.strInstructions}</p>
<h2>Ingredients</h2>
<ul>
${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
</ul>
</div>
  </div>`;
}

//Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getrandomMeal);
category.addEventListener("click", getMealCategory);
categorySearchBtn.addEventListener("click", searchMealByCategory);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
