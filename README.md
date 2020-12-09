# Currency Conversion Challenge

Build a small application to demonstrate your coding skills that converts an amount in a foreign currency into an amount in Canadian currency on a specific date.

## Requirements

Your application should meet the following requirements:

1.	Convert between foreign currencies and Canadian dollars, and from Canadian dollars to foreign currencies
2.  Use the daily average exchange rate published by the Bank of Canada for conversion between foreign currencies and Canadian dollars
3.	Permit the user to specify the foreign currency to convert to/from by currency code (ISO 4217)
4.	Permit the user to optionally specify the date of the conversion (for converting historical values)
5.	Display the output value to a precision of 4 decimal places
6.	Display the conversion rate and date along with the output value
7.	Convert at least the following foreign currencies: USD, EUR, JPY, GBP, AUD, CHF, CNY, HKD, MXN, INR

## Running the solution

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running lint

Run `ng lint` to execute the linting checks via [TSLint](https://palantir.github.io/tslint/).

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Approach
* Used the following API to get the currency list: https://www.bankofcanada.ca/valet/groups/FX_RATES_DAILY/json. Wanted to get the full list Bank of Canada supported, so that the app can support new currency as well as no longer support any depericated currency. It would help to add to the user experience as well as avoiding any unnessary errors (if a currency is depricated).
* Used the following API to pull the daily average: https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json. There API's decidicated to certain currency conversion, but thought it was easier to pull it from one source rather then multiple. Also avoiding the risk for that currency not being available.
* Converter Service is used to pull the API's nesessary to support:
** Getting the min / max date, this will help so that we can support as far back as what the Bank of Canada can support as well as the last date is supporting
** Getting the list of current currencys so the user is able to pick and choose what they want to convert
** Converting currency from/to CAD
* Converter Component is used for user to pick the currency to convert. The can either convert it to CAD or from CAD as well as the option to pick the date based on the currency
* Converter Details is used to show the result of the conversion. It will show the conversion based on the entered amount from the user as well as the the dollar rate for each to/from currency based on the date chosen.

## To Do
* Add more unit testing around the conversion service. Want to focus on the conversion it self checking the expected result as well as checking out failed instances.
