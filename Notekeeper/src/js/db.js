"use strict";

import {
  generateID, 
  findNotebook,
  findnotebookIndex,
  findNote,
  findNoteIndex,
} from "./utils.js";

// DataBase object
let notekeeperDB = {};

/** Initalizes a local database
 * if the data exists in local storage, it is added
 * otherwise a new empty database strucrture is created and stored
 */

const initDB = function () {
  const db = localStorage.getItem("notekeeperDB");

  if (db) {
    notekeeperDB = JSON.parse(db);
  } else {
    notekeeperDB.notebooks = [];
    localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
  }
};

initDB();

// Reads and loads the localStorage data in to the global variable 'notekeeperDB'.

const readDB = function () {
  notekeeperDB = JSON.parse(localStorage.getItem("notekeeperDB"));
};

// Writes the current state of the global variable 'notekeeperDB' to local storage

const writeDB = function () {
  localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
};

/**
 * Collection of functions for performing CRUD (Create, Read, Update, Delete) operations on database.
 * The datbase state is managed using global variables and local storage.
 *
 * @namespace
 * @property {Object} get - Functions for retrieving data from the database.
 * @property {Object} post -  Functions for adding data to the database.
 * @property {Object} update -  Functions for updateing data in the database.
 * @property {Object} delete -  Functions for deleteing data from the database.
 */
export const db = {
  post: {
    /**
     * @function
     * @param {string} name - The name of the new notebook.
     * @returns {Object} - the newly created notebook Object
     */

    notebook(name) {
      readDB();

      const notebookData = {
        id: generateID(),
        name,
        notes: [],
      };
      notekeeperDB.notebooks.push(notebookData);

      writeDB();

      return notebookData;
    },

    /**
     * Adds a new note to a specified notebook in the database
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to add the note to.
     * @param {Object} object - The note object to add.
     * @returns {Object} The newly created note object.
     *
     */
    note(notebookId, object) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteData = {
        id: generateID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };

      notebook.notes.unshift(noteData);
      writeDB();

      return noteData;
    },
  },

  get: {
    /**
     * Retrieves all noteboks from the database
     * @function
     * @returns {Array<Object>} - An array of notebook objects
     */

    notebook() {
      readDB();

      return notekeeperDB.notebooks;
    },

    /**
     * Retrieves all notes within a speciefied notebook.
     *
     * @function
     * @param {string} notebookId - The ID of the notebook to retrieve notes from.
     * @returns {Array<Object>} An array of note objects
     */
    note(notebookId) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      return notebook.notes;
    },
  },

  update: {
    /**
     * Update the name of a notebook in database
     *
     * @param {string} notebookId - The Id of the notebook to update
     * @param {string} name - The new name for the notebook
     * @returns {Object} - The update notebook object
     */
    notebook(notebookId, name) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      notebook.name = name;

      writeDB();

      return notebook;
    },

    /**
     * Updates the content of a note in the database.
     *
     * @function
     * @param {string} noteId - The ID of the note to update
     * @param {Object} object - The updated data for the note.
     * @returns {Object} - The updated note object.
     */
    note(noteId, object) {
      readDB();

      const oldNote = findNote(notekeeperDB, noteId);
      const newNote = Object.assign(oldNote, object);

      writeDB();

      return newNote;
    },
  },

  delete: {
    /**
     * Deletes a notebook from the database.
     * @function
     * @param {string} notebookId - The ID of the notebook to delete
     */
    notebook(notebookId) {
      readDB();
      const notebookIndex = findnotebookIndex(notekeeperDB, notebookId);
      notekeeperDB.notebooks.splice(notebookIndex, 1);

      writeDB();
    },

    /**
     * Delete a note from a specified notebook in the database
     *
     * @function
     * @param {string} notebookId - The ID of the notebook containing the note to delete.
     * @param {string} noteId - The ID of the note to delete.
     * @returns {Array<Object>} An array of remaining notes in the notebook.
     */

    note(notebookId, noteId) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);

      notebook.notes.splice(noteIndex, 1);

      writeDB();

      return notebook.notes;
    },
  },
};
