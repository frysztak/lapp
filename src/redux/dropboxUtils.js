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

const compareFiles = (A, B) => {
  if (A.content_hash === B.content_hash) return true;
  return false;
};

export const calculateDiff = (remoteFiles, localFiles) => {
  const actions = [];

  const toDownload = remoteFiles.filter(
    f => !localFiles.find(l => compareFiles(f, l))
  );

  const toUpload = localFiles.filter(
    f => !remoteFiles.find(l => compareFiles(f, l))
  );

  return { toDownload: toDownload, toUpload: toUpload };
};
