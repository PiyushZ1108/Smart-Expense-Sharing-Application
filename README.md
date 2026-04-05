
## 📡 API Usage (cURL)

Below are example `curl` commands for each route in the backend API. Replace `<HOST>` with your server URL and `<TOKEN>` with a valid JWT token where required.

### Users Routes (`/users`)
- **Get all users**
  ```bash
  curl -X GET <HOST>/users 
  ```
- **Create user**
  ```bash
  curl -X POST <HOST>/users \
    -H "Content-Type: application/json" \
    -d '{"email":"new@example.com","password":"pwd"}'
  ```

### Expenses Routes (`/expenses`)
- **Get all expenses**
  ```bash
  curl -X GET <HOST>/expenses/all \

  ```
- **Create expense**
  ```bash
  curl -X POST <HOST>/expenses/create \
    -H "Content-Type: application/json" \

    -d '{"title":"Dinner","amount":45,"paidBy":"userId","splitBetween":["userId1","userId2"]}'
  ```
- **Delete expense**
  ```bash
  curl -X DELETE <HOST>/expenses/<id> \

  ```
- **Get balances**
  ```bash
  curl -X GET <HOST>/expenses/balances \
    -H "Authorization: Bearer <TOKEN>"
  ```
- **Get optimized settlements**
  ```bash
  curl -X GET <HOST>/expenses/settlements \

  ```

### Index Route (`/`)
- **Health check**
  ```bash
  curl -X GET <HOST>/
  ```

## Contributions

Contributions, bug reports, and feature requests are always welcome! If you encounter any issues or have ideas to improve the starter template, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/ahmadjoya/typescript-express-mongoose-starter).
