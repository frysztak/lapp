import { fromDelta } from "quill-delta-markdown";
import DropboxContentHasher from "./dropboxContentHasher";
import moment from "moment";
import {
  DBX_DOWNLOAD,
  DBX_UPLOAD,
  DBX_RENAME,
  LOCAL_RENAME
} from "./dropboxActions";

const convertDateTimeToDropboxFormat = datetime =>
  moment.utc(datetime, moment.ISO_8601).format("YYYY-MM-DDTHH:mm:ss") + "Z";

export const convertNoteToFile = note => {
  const markdown = fromDelta(note.text.ops);
  const hasher = new DropboxContentHasher();
  hasher.update(markdown);
  const date = convertDateTimeToDropboxFormat(note.lastEdit);

  return {
    name: `${note.name}.md`,
    noteId: note.id,
    client_modified: date,
    server_modified: date,
    content: markdown,
    content_hash: hasher.digest()
  };
};

const compareFiles = (noteA, noteB) =>
  noteA.content_hash === noteB.content_hash;

const detectRenames = (setA, setB, setNoteId = false) => {
  return setA
    .map(noteA => {
      const noteB = setB.find(l => compareFiles(noteA, l));
      if (!noteB) return undefined;
      if (
        noteA.name !== noteB.name &&
        noteA.server_modified > noteB.server_modified
      ) {
        const action = {
          oldName: noteB.name,
          newName: noteA.name,
          lastEdit: noteA.server_modified
        };
        const noteId = noteA.noteId ? noteA.noteId : noteB.noteId;
        if (noteId && setNoteId) action.noteId = noteId;

        return action;
      }
      return undefined;
    })
    .filter(x => x); // removes undefines
};

const detectTransfers = (setA, setB) => {
  return setA
    .map(noteA => {
      const sameHash = setB.find(l => noteA.content_hash === l.content_hash);
      if (sameHash) return undefined;

      const sameName = setB.find(l => noteA.name === l.name);
      if (sameName) {
        const isOlder = noteA.server_modified > sameName.server_modified;
        return isOlder ? { ...noteA, noteId: sameName.noteId } : undefined;
      }

      return noteA;
    })
    .filter(x => x); // removes undefines
};

const getUpToDateLocalFiles = (diff, localFiles) => {
  let upToDate = localFiles;
  upToDate = upToDate.filter(
    f => !diff.toDownload.find(l => f.name === l.name)
  );

  upToDate = upToDate.filter(f => !diff.toUpload.find(l => f.name === l.name));

  return upToDate;
};

export const calculateDiff = (remoteFiles, localFiles) => {
  const toDownload = detectTransfers(remoteFiles, localFiles);
  const toUpload = detectTransfers(localFiles, remoteFiles);

  const toRenameLocal = detectRenames(remoteFiles, localFiles, true);
  const toRenameRemote = detectRenames(localFiles, remoteFiles);

  const diff = {
    toDownload: toDownload,
    toUpload: toUpload,
    toRenameLocal: toRenameLocal,
    toRenameRemote: toRenameRemote
  };

  const upToDate = getUpToDateLocalFiles(diff, localFiles);
  return { ...diff, upToDate: upToDate };
};

export const convertDiffToActions = diff => {
  const downloads = diff.toDownload.map(file => ({
    type: DBX_DOWNLOAD,
    filename: file.name,
    client_modified: file.client_modified,
    noteId: file.noteId
  }));

  const uploads = diff.toUpload.map(file => ({
    type: DBX_UPLOAD,
    file: file
  }));

  const remoteRenames = diff.toRenameRemote.map(file => ({
    type: DBX_RENAME,
    oldName: file.oldName,
    newName: file.newName
  }));

  const localRenames = diff.toRenameLocal.map(file => ({
    type: LOCAL_RENAME,
    noteId: file.noteId,
    oldName: file.oldName,
    newName: file.newName,
    lastEdit: file.lastEdit
  }));

  return [...downloads, ...uploads, ...remoteRenames, ...localRenames];
};
