"use strict";

/**
 * Represents a book.
 * @param {Array<HTMLElement>} $elements - The title of the book.
 * @param {string} eventType - The author of the book.
 * @param {Function} callback - The author of the book.
 */

const addEventOnElements = function ($elements, eventType, callback) {
  $elements.forEach(($elements) =>
    $elements.addEventListener(eventType, callback)
  );
};

/**
 * Represents a book.
 * @param {number} currentHour - The current hour (0 - 23) to determine the
 *   appropriate greeting.
 * @returns {string} - A greeting message with a salutation
 *   corresponding to the time of day.
 */

const getGreetingMsg = function (currentHour) {
  const greeting =
    currentHour < 5
      ? "Night"
      : currentHour < 12
      ? "Morning"
      : currentHour < 15
      ? "Noon"
      : currentHour < 17
      ? "Afternoon"
      : currentHour < 20
      ? "Evening"
      : "Night";

  return `Good ${greeting}`;
};

let $lastActiveNavItem;

// Activates a navications item by adding the ' active ' class and decactives the previously active item

const activeNotebook = function () {
  $lastActiveNavItem?.classList.remove("active");
  this.classList.add("active");
  $lastActiveNavItem = this;
};

/**
 * Represents a book.
 * @param {HTMLElement} $element - The title of the book.
 */

const makeElemEditable = function ($element) {
  $element.setAttribute("contenteditable", true);
  $element.focus();
};

/**
 * Generates a unique ID based on the current time
 * @returns {string} - A string representation of the current timestamp
 */

const generateID = function () {
  return new Date().getTime().toString();
};

/**
 * Finds a notebook in database by its ID
 *
 * @param {*} db - The database containing the notebooks
 * @param {*} notebookId - The ID of the  notebook find
 * @returns {Object | undefined} - the found notebook object, or undefined if not found
 */

const findNotebook = function (db, notebookId) {
  return db.notebooks.find((notebook) => notebook.id === notebookId);
};

/**
 * Finds the index of a notebook in an array of notebooks based on its ID.
 *
 * @param {Object} db - The object containing an array of notebooks.
 * @param {string} notebookId - The ID of the notebook to find.
 * @returns {number} The index of the found notebook, or -1 if not found.
 */
const findnotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex((item) => item.id === notebookId);
};

/**
 * Converts a timestamp in milliseconds to a human-readable relative time string.
 *
 * @param {number} milliseconds - The timestamp in milliseconds to convert
 * @returns {string}
 */

const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();

  const minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  return minute < 1
    ? "Just now"
    : minute < 60
    ? `${minute} min ago`
    : hour < 24
    ? `${hour} hour ago`
    : `%{day} day ago`;
};

/**
 * Finds a specific note by its ID within a database of notebooks and their notes.
 *
 * @param {Object} db - The database containing notebooks and notes
 * @param {string} noteId - The ID of the note to find.
 * @returns {Object | undefined} The found note objects, or undefined if not found.
 */
const findNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find((note) => note.id === noteId);
    if (note) break;
  }
  return note;
};

/**
 * Finds the index of a note in a notebook's array of notes based on its ID
 *
 * @param {Object} notebook - The notebook object containing an array of notes
 * @param {string} noteId - The ID of the note to find
 * @returns {number} The index of the Found note, of -1 if not found
 */
const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex((note) => note.id === noteId);
};

export {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
  generateID,
  findNotebook,
  findnotebookIndex,
  getRelativeTime,
  findNote,
  findNoteIndex,
};
