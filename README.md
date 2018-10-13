To run in production,

- Set up a fullnode with c-lightning as describe in DamianMee's medium posts
- Install lightning-charge onto it

On another server,

- Install nodejs
- Clone and install this, and configure it to point at your lightning-charge service 
- Add files for sale to `for-sale/`

- Run lightning charge `charged --api-token mySecretToken -i 0.0.0.0`
- Run this `node app.js`
