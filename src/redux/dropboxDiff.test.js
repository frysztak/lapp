import { calculateDiff } from "./dropboxDiff";

it("Nothing to upload, download everything", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:53:00")
    },
    {
      name: "B",
      content_hash: "hashB",
      client_modified: new Date("2008-09-15T15:53:00")
    }
  ];
  const localFiles = [];

  const { toDownload, toUpload, toRenameLocal, toRenameRemote } = calculateDiff(
    remoteFiles,
    localFiles
  );
  expect(toDownload).toEqual(remoteFiles);
  expect(toUpload).toEqual([]);
  expect(toRenameLocal).toEqual([]);
  expect(toRenameRemote).toEqual([]);
});

it("Everything to upload and download", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:53:00")
    },
    {
      name: "B",
      content_hash: "hashB",
      client_modified: new Date("2008-09-15T15:53:00")
    }
  ];
  const localFiles = [
    {
      name: "C",
      content_hash: "hashC",
      client_modified: new Date("2008-09-15T15:53:00")
    }
  ];

  const { toDownload, toUpload, toRenameLocal, toRenameRemote } = calculateDiff(
    remoteFiles,
    localFiles
  );
  expect(toDownload).toEqual(remoteFiles);
  expect(toUpload).toEqual(localFiles);
  expect(toRenameLocal).toEqual([]);
  expect(toRenameRemote).toEqual([]);
});

it("Download just one", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:53:00")
    },
    {
      name: "B",
      content_hash: "hashB",
      client_modified: new Date("2008-09-15T15:53:00")
    }
  ];
  const localFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:50:00")
    }
  ];

  const { toDownload, toUpload, toRenameLocal, toRenameRemote } = calculateDiff(
    remoteFiles,
    localFiles
  );
  expect(toDownload).toEqual([remoteFiles[1]]);
  expect(toUpload).toEqual([]);
  expect(toRenameLocal).toEqual([]);
  expect(toRenameRemote).toEqual([]);
});

it("Rename local file instead of downloading", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:53:00") // modified later than local:A
    },
    {
      name: "B",
      content_hash: "hashB",
      client_modified: new Date("2008-09-15T15:54:00")
    }
  ];
  const localFiles = [
    {
      name: "C",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:50:00")
    }
  ];

  const { toDownload, toUpload, toRenameLocal, toRenameRemote } = calculateDiff(
    remoteFiles,
    localFiles
  );
  expect(toDownload).toEqual([remoteFiles[1]]);
  expect(toUpload).toEqual([]);
  expect(toRenameLocal).toEqual([
    {
      oldName: "C",
      newName: "A"
    }
  ]);
  expect(toRenameRemote).toEqual([]);
});

it("Rename remote file instead of uploading", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:53:00")
    },
    {
      name: "B",
      content_hash: "hashB",
      client_modified: new Date("2008-09-15T15:54:00")
    }
  ];
  const localFiles = [
    {
      name: "C",
      content_hash: "hashA",
      client_modified: new Date("2008-09-15T15:55:00") // modified later than remote:A
    }
  ];

  const { toDownload, toUpload, toRenameLocal, toRenameRemote } = calculateDiff(
    remoteFiles,
    localFiles
  );
  expect(toDownload).toEqual([remoteFiles[1]]);
  expect(toUpload).toEqual([]);
  expect(toRenameLocal).toEqual([]);
  expect(toRenameRemote).toEqual([
    {
      oldName: "A",
      newName: "C"
    }
  ]);
});
