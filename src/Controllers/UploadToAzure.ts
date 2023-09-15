import azure from "azure-storage";

const storageAccount = "storagegiovanni1";
const storageAccessKey =
  "ADoJemPPAQs0EVZLS1g1yg7ru08mHgp2H3eu38o06MaO1hwj7KudqelT5uw3pc62mkgjgXffEo2B+AStPkuiZQ==";
const containerName = "uploads";
const accessKey = "sp=racwdli&st=2023-08-31T11:51:28Z&se=2025-01-01T20:51:28Z&sv=2022-11-02&sr=c&sig=ZVxdzl24LvHR1f7YpJJyvJR5eKW%2BZcuiXNFr0jQZQ4k%3D";

const blobService = azure.createBlobService(storageAccount, storageAccessKey);

const uploadImageToAzure = (blobName: string, pathToFile: string) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(
      containerName,
      blobName,
      pathToFile,
      (error, result, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export { uploadImageToAzure };
