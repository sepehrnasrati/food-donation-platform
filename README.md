# Food Donation Platform

A full-stack web app that connects food donors (individuals and businesses) with local food banks, to reduce food waste and food insecurity. It was built by an 8-person team for the Level 2 Group Project at Brunel University London (2024–25) and is aligned with UN Sustainable Development Goals 2 (Zero Hunger) and 12 (Responsible Consumption and Production).

**My contribution:** I proposed, designed and built the **Expiry Date Tracker** end to end, covering the React frontend, Spring Boot REST API and database persistence. The rest of the platform was built by my teammates. [Watch the demo of my feature](https://www.youtube.com/watch?v=IJcyNDDxvgU)

## Platform features

| Feature | Description |
| --- | --- |
| **Expiry Date Tracker** *(my feature)* | Track food items and their expiry dates, with colour-coded alerts, search, sorting and editing |
| Food donations | Donors list surplus food; food banks see incoming donations |
| Discover food banks | Find nearby food banks on a map (Google Maps) |
| Recipe generator | Suggests recipes for leftover ingredients (TheMealDB API) |
| Community forum | Posts, replies and likes for sharing sustainability tips |
| Leaderboard | Ranks donors by contribution, with live updates |
| Chat | Real-time messaging between users over WebSockets |
| Accounts | JWT-based login for individual, business and food bank accounts |

## Expiry Date Tracker

![Demo](https://img.youtube.com/vi/IJcyNDDxvgU/hqdefault.jpg)

**Backend** (`API/src/main/java/com/FDS/API/ExpiryDate/`)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/expiry/add` | Add a food item with an expiry date |
| GET | `/expiry/all` | List all items |
| PUT | `/expiry/update/{id}` | Edit an item's name or expiry date |
| DELETE | `/expiry/delete/{id}` | Remove an item |
| GET | `/expiry/search?query=` | Case-insensitive search by name |

- Spring Boot controller, JPA entity (`LocalDate` expiry field) and repository with a derived search query (`findByFoodItemContainingIgnoreCase`)

**Frontend** (`frontend/src/Pages/Donor/ExpiryDates/`)

- Calculates days remaining and colour-codes each item: **red** when expired, **yellow** within 3 days, **green** otherwise
- Search by name, sort by expiry date (ascending or descending) and edit items using pre-filled forms
- Tested manually across browsers, including edge cases such as blank inputs, past dates and duplicate names

## Tech stack

**Frontend:** React 18 · Vite · Axios · Tailwind CSS · STOMP over WebSockets
**Backend:** Java 21 · Spring Boot 3 · Spring Security (JWT) · Spring Data JPA · H2 · Spring Mail · WebSockets
**Process:** Agile Scrum across three sprints, planned in Notion

## How to run

**Backend.** Requires JDK 21.
```bash
cd API
./mvnw spring-boot:run      # Windows: mvnw spring-boot:run
```
The API runs on `http://localhost:8080`, and the H2 console is at `http://localhost:8080/h2-console` (user `sa`, no password).

**Frontend.** Requires Node.js.
```bash
cd frontend
cp .env.example .env    # add your own Google Maps API key
npm install
npm run dev
```
Open `http://localhost:5173`.

Email notifications and AI features need your own credentials (`MAIL_USERNAME`, `MAIL_PASSWORD` and a Hugging Face token). The rest of the app runs without them.

### Test accounts

| Account type | Email | Password |
| --- | --- | --- |
| Individual | j.doe@example.com | johnPass |
| Business | greggs@example.com | greggsPass |
| Food bank | trussell.trust@example.com | trussellPass |

## Team

Built by Group 25, BSc Computer Science, Brunel University London. Expiry Date Tracker by **Sepehr Nasrati** · [LinkedIn](https://www.linkedin.com/in/sepehr-nasrati) · [GitHub](https://github.com/sepehrnasrati)
