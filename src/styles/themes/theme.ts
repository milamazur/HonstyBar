import { extendTheme } from "@chakra-ui/react";

export const baseTheme = extendTheme({
    styles: {
        global: {
            'html': {
                height: '100vh'
            }
        }
    },
    colors: {
        primary: '#468189',
        secondary: '#77ACA2',
        dark: '#031926',
        light: "#9DBEBB"
    }
});