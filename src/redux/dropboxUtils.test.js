import { calculateDiff } from "./dropboxUtils";

it("Nothing to upload, download everything", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA"
    },
    {
      name: "B",
      content_hash: "hashB"
    }
  ];
  const localFiles = [];

  const { toDownload, toUpload } = calculateDiff(remoteFiles, localFiles);
  expect(toDownload).toEqual(remoteFiles);
  expect(toUpload).toEqual([]);
});

it("Everything to upload and download", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA"
    },
    {
      name: "B",
      content_hash: "hashB"
    }
  ];
  const localFiles = [
    {
      name: "C",
      content_hash: "hashC"
    }
  ];

  const { toDownload, toUpload } = calculateDiff(remoteFiles, localFiles);
  expect(toDownload).toEqual(remoteFiles);
  expect(toUpload).toEqual(localFiles);
});

it("Download just one", () => {
  const remoteFiles = [
    {
      name: "A",
      content_hash: "hashA"
    },
    {
      name: "B",
      content_hash: "hashB"
    }
  ];
  const localFiles = [
    {
      name: "A",
      content_hash: "hashA"
    }
  ];

  const { toDownload, toUpload } = calculateDiff(remoteFiles, localFiles);
  expect(toDownload).toEqual([remoteFiles[1]]);
  expect(toUpload).toEqual([]);
});
