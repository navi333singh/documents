
export const images = (img: string) => {
    switch (img) {
        case "ID":
            return require('../assets/images/logoCard/id.png');
        case "TS":
            return require('../assets/images/logoCard/TS.png');
        case "Patente":
            return require('../assets/images/logoCard/patente_logo.png');
        case "passaporto":
            return require('../assets/images/logoCard/passaporto.png');
    }
};
