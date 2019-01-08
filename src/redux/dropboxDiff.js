import { fromDelta } from "quill-delta-markdown";
import DropboxContentHasher from "./dropboxContentHasher";
import moment from "moment";
import {
  DBX_DOWNLOAD,
  DBX_UPLOAD,
  DBX_RENAME,
  LOCAL_RENAME
} from "./dropboxActions";

const convertDateTimeToDropboxFormat = datetime => {
  return (
    moment.utc(datetime, moment.ISO_8601).format("YYYY-MM-DDTHH:mm:ss") + "Z"
  );
};

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
          newName: noteA.name
        };
        const noteId = noteA.noteId ? noteA.noteId : noteB.noteId;
        if (noteId && setNoteId) action.noteId = noteId;

        return action;
      }
      return undefined;
    })
    .filter(x => x); // removes undefines
};

export const calculateDiff = (remoteFiles, localFiles) => {
  const toDownload = remoteFiles.filter(
    f => !localFiles.find(l => compareFiles(f, l))
  );

  const toUpload = localFiles.filter(
    f => !remoteFiles.find(l => compareFiles(f, l))
  );

  const toRenameLocal = detectRenames(remoteFiles, localFiles, true);
  const toRenameRemote = detectRenames(localFiles, remoteFiles);

  return {
    toDownload: toDownload,
    toUpload: toUpload,
    toRenameLocal: toRenameLocal,
    toRenameRemote: toRenameRemote
  };
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
    newName: file.newName
  }));

  return [...downloads, ...uploads, ...remoteRenames, ...localRenames];
};
