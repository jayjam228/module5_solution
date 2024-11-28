$(function () { 
  // Same as document.addEventListener("DOMContentLoaded"...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function (event) {
  // Show loading icon
  showLoading("#main-content");

  // Fetch categories data
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML, // STEP 1: Pass the function that handles categories
    true
  );
});

// Builds HTML for the home page
function buildAndShowHomeHTML(categories) {
  // Load home snippet
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
      // STEP 2: Choose a random category
      var chosenCategory = chooseRandomCategory(categories);
      var chosenCategoryShortName = "'" + chosenCategory.short_name + "'"; // Wrap in quotes

      // STEP 3: Replace {{randomCategoryShortName}} in home snippet
      var homeHtmlToInsertIntoMainPage = insertProperty(
        homeHtml,
        "randomCategoryShortName",
        chosenCategoryShortName
      );

      // STEP 4: Insert the resulting HTML into the main content
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false
  );
}

// Returns a random category object
function chooseRandomCategory(categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML
  );
};

// Load the menu items view
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML
  );
};

// Other functions remain unchanged...

global.$dc = dc;

})(window);
