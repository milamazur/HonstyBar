import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import { useRef } from 'react';

type AlertPopupParams = {
    isOpen: boolean,
    onClose: () => void
    onCancel: () => void
    title: string
    desciption: string
    cancelButtonText: string
    confirmButtonText: string
}

function AlertPopup({ isOpen, onClose, onCancel, title, desciption, cancelButtonText, confirmButtonText }: AlertPopupParams) {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={ref}
                onClose={onClose}
                isCentered
                size="3xl"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            {title}
                        </AlertDialogHeader>

                        <AlertDialogBody >
                            {desciption}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button  onClick={onClose}>
                                {cancelButtonText}
                            </Button>
                            <Button colorScheme='red' onClick={() => onCancel()} ml={3}>
                                {confirmButtonText}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default AlertPopup;