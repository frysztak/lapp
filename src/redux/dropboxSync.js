import Note, { NoteStatus } from "./../Note";
import uuidv1 from "uuid/v1";
import { Dropbox } from "dropbox";
import { fromDelta } from "quill-delta-markdown";
import moment from "moment";
import Cookies from "js-cookie";
import { env as Env } from "../Env";
import { setDropboxSyncEnabled } from "./actions";

export default class DropboxSync {
  constructor(store) {
    this.dropbox = new Dropbox({ fetch: window.fetch });
  }

  attach(store) {
    this.store = store;

    const accessToken = Cookies.get(Env.DropboxAccessTokenCookieName);
    if (accessToken) {
      store.dispatch(setDropboxSyncEnabled(true));
      this.dropbox.setAccessToken(accessToken);
    }

    store.subscribe(() => {
      const accessToken = store.getState().dropbox.dbxAccessToken;
      if (accessToken !== this.dropbox.getAccessToken()) {
        this.dropbox.setAccessToken(accessToken);
      }
    });
  }

  convertDateTimeToDropboxFormat(datetime) {
    return (
      moment.utc(datetime, moment.ISO_8601).format("YYYY-MM-DDTHH:mm:ss") + "Z"
    );
  }

  getLocalFileList() {
    return this.notes.map(note => {
      return {
        name: `${note.name}.md`,
        id: note.id,
        last_modified: this.convertDateTimeToDropboxFormat(note.lastEdit),
        content: fromDelta(note.text.ops)
      };
    });
  }

  async beginDropboxSync() {
    const dbxFilesResponse = await this.dropbox.filesListFolder({ path: "" });
    if (dbxFilesResponse.has_more) {
      throw Error("has_more");
    }

    const dbxFiles = dbxFilesResponse.entries.filter(file =>
      file.name.endsWith(".md")
    );
    const localFiles = this.getLocalFileList();

    const filesToDownload = dbxFiles.filter(remoteFile => {
      const localIdx = localFiles.findIndex(
        localFile => localFile.name === remoteFile.name
      );
      if (localIdx === -1) return true;

      if (remoteFile.last_modified > localFiles[localIdx].last_modified)
        return true;

      return false;
    });

    const filesToUpload = localFiles.filter(localFile => {
      const remoteIdx = dbxFiles.findIndex(
        remoteFile => remoteFile.name === localFile.name
      );
      if (remoteIdx === -1) return true;

      if (dbxFiles[remoteIdx].last_modified > localFile.last_modified)
        return true;

      return false;
    });

    console.log(dbxFilesResponse);
    console.log(dbxFiles);
    console.log(localFiles);
    console.log(filesToDownload);
    console.log(filesToUpload);

    await this.uploadFiles(filesToUpload);
  }

  async uploadFiles(localFiles) {
    for (const file of localFiles) {
      this.updateNoteSyncStatus(file.id, NoteStatus.IN_PROGRESS);

      await this.dropbox.filesUpload({
        contents: file.content,
        path: `/${file.name}`,
        client_modified: file.last_modified
      });

      this.updateNoteSyncStatus(file.id, NoteStatus.OK);
    }
  }
}
