import { fromDelta } from "quill-delta-markdown";
import DropboxContentHasher from "./dropboxContentHasher";
import moment from "moment";

const convertDateTimeToDropboxFormat = datetime => {
  return (
    moment.utc(datetime, moment.ISO_8601).format("YYYY-MM-DDTHH:mm:ss") + "Z"
  );
};

export const convertNoteToFile = note => {
  const markdown = fromDelta(note.text.ops);
  const hasher = new DropboxContentHasher();
  hasher.update(markdown);

  return {
    name: `${note.name}.md`,
    id: note.id,
    client_modified: convertDateTimeToDropboxFormat(note.lastEdit),
    content: markdown,
    content_hash: hasher.digest()
  };
};

const compareFiles = (noteA, noteB) => {
  if (noteA.content_hash === noteB.content_hash) return true;
  return false;
};

const detectRenames = (setA, setB) => {
  return setA
    .map(noteA => {
      const noteB = setB.find(l => compareFiles(noteA, l));
      if (!noteB) return undefined;
      if (
        noteA.name !== noteB.name &&
        noteA.client_modified > noteB.client_modified
      ) {
        return {
          oldName: noteB.name,
          newName: noteA.name
        };
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

  const toRenameLocal = detectRenames(remoteFiles, localFiles);
  const toRenameRemote = detectRenames(localFiles, remoteFiles);

  return {
    toDownload: toDownload,
    toUpload: toUpload,
    toRenameLocal: toRenameLocal,
    toRenameRemote: toRenameRemote
  };
};
