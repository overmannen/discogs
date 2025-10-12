import currencyapicom
from config import CURRENCY_API_KEY 

client = currencyapicom.Client(CURRENCY_API_KEY)


def eur_to_nok(eur):
    result = client.latest(base_currency='EUR', currencies=['NOK'])
    rate = result['data']['NOK']['value']
    return int(eur*rate)

print(eur_to_nok(1500))