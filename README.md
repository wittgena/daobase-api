# daobase-io

## Admin Hosted Campaigns

These APIs are to create, modify and deploy campaigns on the platform. The user must be logged in. Include the JWT in the header as 'x-access-token'.

The possible status for a campaign are as follows.

![Daobase States](images/states.png?raw=true)


### Campaigns On-Chain Data


Success should return 201. The fields that can be edited are

| Field            | Type   | Description                                                                                                                                             |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tokenSymbol      | String | The symbol to display on exchanges. Must be latin characters [A-Z](?).                                                                                  |
| tokenName        | String | The long name of the token. Must be latin characters and spaces (?).                                                                                    |
| isMinted         | Bool   | If false the hard cap is allocated as intial supply and transfered for purchase. If true the intial supply is 0, the token is minted for each purchase. |
| numberOfDecimals | Number | Must be an integer between 0 and 18.                                                                                                                    |
| startingTime     | Number | Unix timestamp (seconds) to start the campaign. Must be at least 24 hours in the future.                                                                |
| duration         | Number | The number of days the campaign will run. Must be greater than 1.                                                                                       |
| softCap          | String | The minimum to be raised. Must be greater than 0. The unit is wei, must be an integer.                                                                  |
| hardCap          | String | The maximum that can be raised. Must be greater than the softCap. The unit is wei, must be an integer.                                                  |
| rate             | String | The price of the token. The tokens recieved from a purchase will be Wei _ rate _ 10^-decimals. This must be an integer.                                 |
| network          | String | The name of the network. Only rinkeby is supported now.                                                                                                 |

### Campaigns Off-Chain Data


| Field         | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| coverImageURL | String   | The url for the cover image.         |
| whitePaperURL | String   | The url for the white paper.         |
| description   | String   | A short description of the campaign. |
| keywords      | [String] | A list of keywords for the campaign. |


## Admin for External Campaigns

| Field         | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| name          | String   | The name of the campaign.            |
| symbol        | String   | The token symbol.                    |
| description   | String   | A short description of the ICO.      |
| companyURL    | String   | The URL to the main site of the company. |
| whitePaperURL | String   | A URL to the white paper.            |
| coverImageURL | String   | A URL for the image to use as a cover image. |
| preICO        | Duration | The openingTime and closingTime in unix time. |
| ico           | Duration | The openingTime and closingTime in unix time. |
| links         | [Link]   | The type and url of any additional links. |
| location      | String   | The country in which the company is based. |
| team          | [Member] | A list of the team members (this needs to be improved - members shared between ICOs). |

## Alternative Payment

| Field          | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| amount         | String   | The amount the payer must transfer in their chosen currency. |
| transactionId  | String   | The id as generated by coin payments. |
| address        | String   | The address into which funds should be transferred. |
| confirmsNeeded | String | The number of confirmations required before transfer is made. |
| timeout        | Number | The number of seconds for which the transfer can be made. |
| statusURL      | String | Check the status via coin payments. |
| qrCodeURL      | String | Generate a QR code (via coin payments). |
| currency       | String | The currency to make the payment in. |
| tokenTransferFee | String | The estimated gas cost to perform transfer (in wei). This is already included in the amount. |

# Run a Testing Environment

There are three components;
1. MongoDB
2. The api server.

## MongoDB

Launch MongoDB in docker with;
```bash
docker run --name daobase-mongo-dev -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=test -e MONGO_INITDB_ROOT_PASSWORD=test -d mongo:4
```

## Launch API Server
### ENV Variables
You need to set some environment variables;

	MONGO_USERNAME=test
	MONGO_PASSWORD=test
	MONGO_HOST=localhost
	MONGO_PORT=27017
	TRUSTFEED_ADDRESS=0x3aa9ce734dd21fa5e6962978e2ccc7f4ac513348
	AWS_ACCESS_KEY_ID
	AWS_SECRET_ACCESS_KEY
	AWS_REGION
	INFURA_KEY
	FRONTEND_HOST=http://localhost:3000
	COIN_PAYMENTS_ADDRESS
	COIN_PAYMENTS_PRIVATE_KEY
	COIN_PAYMENTS_KEY
	COIN_PAYMENTS_SECRET
	COIN_PAYMENTS_IPN_SECRET
	COIN_PAYMENTS_MERCHANT_ID

### Local Test
Then use node (or yarn) to

```bash
npm install
npm run start
```
