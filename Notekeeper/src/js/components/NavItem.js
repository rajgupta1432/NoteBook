"use strict";

import { Tooltip } from "./Tooltip.js";
import { activeNotebook, makeElemEditable } from "../utils.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { DeleteConfirmModal } from "./Modal.js";

const $notebookPanelTitle = document.querySelector("[data-note-panel-title]");

/**
 * Creates a navication item representing a notebook. this item displays the notebooks name, allows editing and
 * deletion of the notebook, and handles click events to display its associated notes
 *
 * @param {string} id - unique id of the notebook
 * @param {string} name - The name of the notebook
 * @returns {HTMLElement} - An HTML element representing the navication item for the notebook
 */
export const NavItem = function (id, name) {
  const $navItem = document.createElement("div");
  $navItem.classList.add("nav-item");
  $navItem.setAttribute("data-notebook", id);

  $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field>${name}</span>

    <button
      class="icon-btn small"
      aria-label="Edit notebook"
      data-tooltip="Edit notebook"
      data-edit-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">edit</span>
      <div class="state-layer"></div>
    </button>

    <button
      class="icon-btn small"
      aria-label="Delete notebook"
      data-tooltip="Delete notebook"
      data-delete-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">delete</span>
      <div class="state-layer"></div>
    </button>
    <div class="state-layer"></div>
  `;

  const $tooltipElems = $navItem.querySelectorAll("[data-tooltip]");

  $tooltipElems.forEach(($elem) => Tooltip($elem));

  //   Handles the click event on the navigation item. Updates the note panel's title, retrieves the associated notes, and  marks the item as active

  $navItem.addEventListener("click", function () {
    $notebookPanelTitle.textContent = name;
    activeNotebook.call(this);

    const noteList = db.get.note(this.dataset.notebook);
    client.note.read(noteList);
  });

  // Notebook edit functionality

  const $navItemEditBtn = $navItem.querySelector("[data-edit-btn]");
  const $navItemField = $navItem.querySelector("[data-notebook-field]");

  $navItemEditBtn.addEventListener(
    "click",
    makeElemEditable.bind(null, $navItemField)
  );

  $navItemField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      this.removeAttribute("contenteditable");

      // Update edit data in database
      const updatedNotebookData = db.update.notebook(id, this.textContent);

      // Render update notebook
      client.notebook.update(id, updatedNotebookData);
    }
  });

  // Notebook delete functionality

  const $navItemDeleteBtn = $navItem.querySelector("[ data-delete-btn]");

  $navItemDeleteBtn.addEventListener("click", function () {
    const modal = DeleteConfirmModal(name);

    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        db.delete.notebook(id);
        client.notebook.delete(id);
      }
      modal.close();
    });
  });
  return $navItem;
};
