class SortType {
  constructor(id, parameter, modifier) {
    this.id = id;
    this.parameter = parameter;
    this.modifier = modifier;
  }
}

export const SortTypes = [
  new SortType(0, "Name", "asc"),
  new SortType(1, "Name", "desc"),
  new SortType(2, "Last edited", "asc"),
  new SortType(3, "Last edited", "desc")
];

export const NoteStatus = {
  DETACHED: 0, // used when synchronization is disabled
  IN_PROGRESS: 1,
  OK: 2,
  ERROR: 3
};
