type BalanceParams = {
    balance: number
}

function Balance({ balance }: BalanceParams) {
    const formatter = new Intl.NumberFormat('nl-BE', {
        style: 'currency',
        currency: 'EUR'
    });
    let balanceReturn = formatter.format(balance)
    return (<p>{balanceReturn}</p>)
}

export default Balance