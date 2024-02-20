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

type QrComponentParams = {
    user: UserType,
    amount: number,
    reference: string
}

function QrComponent({ user, amount, reference }: QrComponentParams) {
    const { userId } = useParams<{ userId: string }>();

    const transferData: transferParams = {
        serviceTag: "BCD",
        version: "001",
        characterSet: "1",
        identification: "SCT",
        bic: "BHBLDEHHXXX",
        name: "Kenze CVBA",
        iban: "BE09 3631 7917 0457",
        amount: amount,
        purpose: "",
        reference: reference
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
            <Box textAlign={"center"} mt={5} mb={5}>
                <QRCodeSVG value={QRValue} size={250} />
            </Box>
        </>
    )
}

export default QrComponent;