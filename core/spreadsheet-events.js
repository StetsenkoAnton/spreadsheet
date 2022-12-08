export const SEVENTS = {
  CELL: {
    // backend listen, front send
    // cell is focused
    FOCUS: "CELL_FOCUS",
    // save changed value of the cell
    SAVE: "CELL_SAVE",
    // front listen, server send
    // cell unfocused on save
    SAVED: "CELL_SAVED",
    FOCUSED: "CELL_FOCUSED",
  },
  DOCUMENT: {
    // from front to back
    SAVE: "DOCUMENT_SAVE",
    // from back to front
    SAVED: "DOCUMENT_SAVED",
  },
};
