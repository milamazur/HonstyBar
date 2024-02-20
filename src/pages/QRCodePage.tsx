import { Box } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { version } from 'react-dom';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useGetData from '../hooks/useGetData';
import { UserType } from '../types/UserType';

type transferParams = {
    serviceTag: string
    version: string
    characterSet: string
    identification: string
    bic: string
    name: string
    iban: string
    amount: number
    purpose: string
    reference: string
}

function QRCodePage() {
    const { userId } = useParams<{ userId: string }>();
    const { loading: loadingUser, error: errorUser, data: user, refetch: refetchUser } = useGetData<UserType>("/users/" + userId);

    if (loadingUser) {
        return (
            <LoadingSpinner />
        )
    }

    if (errorUser || user === undefined) {
        return (
            <p>Error</p>
        )
    }

    const transferData: transferParams = {
        serviceTag: "BCD",
        version: "001",
        characterSet: "1",
        identification: "SCT",
        bic: "BBRUBEBB",
        name: "Kenze CVBA",
        iban: "BE09 3631 7917 0457",
        amount: 0,
        purpose: "",
        reference: user.id + "-" + new Date().toLocaleString(),
    }

    const QRValue =
        transferData.serviceTag + "\n" +
        transferData.version + "\n" +
        transferData.characterSet + "\n" +
        transferData.identification + "\n" +
        transferData.bic + "\n" +
        transferData.name + "\n" +
        transferData.iban + "\n" +
        "EUR" + transferData.amount + "\n" +
        transferData.purpose + "\n" +
        transferData.reference + "\n" +
        "\n ";

    return (
        <>
            <Box m={5}>
                <QRCodeSVG value={QRValue} size={250} />
            </Box>
        </>
    )
}

export default QRCodePage;