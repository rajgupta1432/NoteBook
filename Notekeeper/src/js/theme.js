"use strict";

// Toggles the theme between 'light' and 'dark'.


const toggleTheme = function () {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme)
};


// Initialize the theme
const storedTheme = localStorage.getItem("theme");
const systemThemeIsDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const initialTheme = storedTheme ?? (systemThemeIsDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", initialTheme);

// Attach toggletheme to theme button click event

window.addEventListener("DOMContentLoaded", function () {
  const $themeBtn = this.document.querySelector("[data-theme-btn]");
  if ($themeBtn) $themeBtn.addEventListener("click", toggleTheme);
});
