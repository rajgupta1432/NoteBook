"use strict";

// Module Import

import {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";

// Toggle slidebar small screen

const $sidebar = document.querySelector("[data-sidebar]");
const $sidebarTogglers = document.querySelectorAll("[data-sidebar-toggler]");
const $overlay = document.querySelector("[data-sidebar-overlay]");

addEventOnElements($sidebarTogglers, "click", function () {
  $sidebar.classList.toggle("active");
  $overlay.classList.toggle("active");
});

// Initialize tooltip behavior for all DOM elements

const $tooltipElems = document.querySelectorAll("[data-tooltip]");
$tooltipElems.forEach(($elem) => Tooltip($elem));

// show greeting  message on homepage

const $greetElement = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();
$greetElement.textContent = getGreetingMsg(currentHour);

// Show current date on time

const $currentDateElem = document.querySelector("[data-current-date]");
$currentDateElem.textContent = new Date().toDateString().replace(" ", ", ");

// NoteBook Create

const $sidebarList = document.querySelector("[data-sidebar-list]");
const $addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = function () {
  const $navItem = document.createElement("div");
  $navItem.classList.add("nav-item");

  $navItem.innerHTML = `
  <span class="text text-label-large" data-notebook-field></span>
  
  <div class="state-layer"></div>
  `;
  $sidebarList.appendChild($navItem);

  const $navItemField = $navItem.querySelector("[data-notebook-field]");

  // Active new created notebook and deactive the last one
  activeNotebook.call($navItem);

  //  Make notebook field content
  makeElemEditable($navItemField);

  // When user press 'Enter' then create notebook
  $navItemField.addEventListener("keydown", createNotebook);
};

$addNotebookBtn.addEventListener("click", showNotebookField);

/**
 * create a notebook.
 * create a notebook When user press 'Enter' key is pressed while
 * editting a notebook name field
 * @param {keyboardEvent} event - The keyboard event that triggered notebook creation
 */

const createNotebook = function (event) {
  if (event.key === "Enter") {
    // new created notebook stored in database
    const notebookData = db.post.notebook(this.textContent || "Untitled");
    this.parentElement.remove();

    //  Render navItem
    client.notebook.create(notebookData);
  }
};

// Renders the existing notebook list by retrieving data from the database and passing it to the client.

const renderExistingNotebook = function () {
  const notebookList = db.get.notebook();
  client.notebook.read(notebookList);
};

renderExistingNotebook();

/**
 * Create new note
 */

const $noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

addEventOnElements($noteCreateBtns, "click", function () {
  // Create and open a new modal
  const modal = NoteModal();

  modal.open();

  modal.onSubmit((noteObj) => {
    const activeNotebookId = document.querySelector("[data-notebook].active")
      .dataset.notebook;

    const noteData = db.post.note(activeNotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
  });
});

// Renders existing notes in the active notebook. Retrieves note data from the database based on the active notebook's ID and uses the client to display the notes

const renderExistingNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active")
    ?.dataset.notebook;

  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);
    client.note.read(noteList);
  }
};
0;

renderExistingNote();
