import { Alert } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';

export const viewFullImage = async ({ fullImage, setLoading }) => {
    try {
        console.log(fullImage)
        if (!fullImage) {
            Alert.alert('Invalid Image URL', 'The provided image URL is null or empty.');
            return;
        }

        setLoading(true); // Show the loader
        const docUrl = fullImage;
        const { config, fs } = RNFetchBlob;
        const { DocumentDir } = fs.dirs;

        const downloadDir = `${DocumentDir}/Downloads`;
        const fileName = fullImage.split('/').pop();
        const filePath = `${downloadDir}/${fileName}`;
        const isDir = await fs.isDir(downloadDir);
        if (!isDir) {
            await fs.mkdir(downloadDir);
        }

        const fileExists = await fs.exists(filePath);
        if (fileExists) {
            // Open the existing file
            await FileViewer.open(filePath, { showOpenWithDialog: true, onDismiss: () => setLoading(false) });
            return;
        }

        // Download the file if it doesn't exist
        const downloadTask = await config({ fileCache: true, path: filePath }).fetch('GET', docUrl);

        // Make sure the download is complete by checking the file again
        const isDownloaded = await fs.exists(filePath);
        if (isDownloaded) {
            // Introduce a small delay to ensure the file system is ready
            setTimeout(async () => {
                await FileViewer.open(filePath, { showOpenWithDialog: true, onDismiss: () => setLoading(false) });
            }, 500); // 500ms delay to ensure the file is ready
        } else {
            Alert.alert('Error', 'File not downloaded properly.');
        }

    } catch (error) {
        if (error && error.message === 'No app associated with this mime type') {
            console.error('No app associated with this MIME type');
            Alert.alert('Error', 'No app associated with this MIME type');
        } else {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Failed to open the file');
        }
    } finally {
        setLoading(false); // Hide the loader
    }
};
