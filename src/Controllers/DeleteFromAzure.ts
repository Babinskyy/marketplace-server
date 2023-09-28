import azure from "azure-storage";
const storageAccount = "storagegiovanni1";
const storageAccessKey =
  "ADoJemPPAQs0EVZLS1g1yg7ru08mHgp2H3eu38o06MaO1hwj7KudqelT5uw3pc62mkgjgXffEo2B+AStPkuiZQ==";
const containerName = "uploads";
const accessKey =
  "sp=racwdli&st=2023-08-31T11:51:28Z&se=2025-01-01T20:51:28Z&sv=2022-11-02&sr=c&sig=ZVxdzl24LvHR1f7YpJJyvJR5eKW%2BZcuiXNFr0jQZQ4k%3D";

const blobService = azure.createBlobService(storageAccount, storageAccessKey);

const deleteBlobFolderFromAzure = async (
  containerName: string,
  directoryName: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // List all blobs in the container
      const blobs: any = await listBlobsInContainer(containerName);

      // Filter and delete blobs that match the directory
      const blobsToDelete = blobs.filter((blob: any) =>
        blob.startsWith(`${directoryName}/`)
      );

      // Delete each matching blob
      for (const blob of blobsToDelete) {
        await deleteBlob(containerName, blob);
      }

      resolve(`Deleted blob folder: ${directoryName}`);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to list all blobs in a container
const listBlobsInContainer = (containerName: string) => {
  return new Promise((resolve, reject) => {
    blobService.listBlobsSegmented(
      containerName,
      null as any,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          const blobNames = result.entries.map((entry) => entry.name);
          resolve(blobNames);
        }
      }
    );
  });
};

// Function to delete a specific blob in a container
const deleteBlob = (containerName: string, blobName: string) => {
  return new Promise((resolve, reject) => {
    blobService.deleteBlobIfExists(containerName, blobName, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
export default deleteBlobFolderFromAzure;
