
// return documents relative path
function getDocumentsPath() {
    return new URL('../documents', import.meta.url);
}

const envUtils = {
    documentsPath: getDocumentsPath,
}

export default envUtils;
