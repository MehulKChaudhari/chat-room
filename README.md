# Chat Application

A simple chat application built with Spring Boot, SockJS, STOMP, and React.js. This project demonstrates real-time communication between clients using WebSockets. The current implementation uses in-app memory for storing messages. Future improvements may include database integration and user authentication.

## Features

- Real-time messaging using WebSockets.
- Public and private chat rooms.
- Basic UI with React.js.
- In-app message storage (no database).

## Screenshots
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/7e79c3ce-9ca7-41ce-8ecc-c7d08f97add4">

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/da9c3d0e-37cb-4cc5-af0e-67d4230f9ead">

## Technologies Used

- **Backend**: Spring Boot
- **WebSocket**: SockJS, STOMP
- **Frontend**: React.js
- **Styling**: CSS

## Getting Started

### Prerequisites

- Java 11 or higher
- Node.js and npm (Node Package Manager)

### Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/your-repository.git
    cd your-repository
    ```

2. **Backend Setup**

    Navigate to the `backend` directory and run the following commands to build and run the Spring Boot application:

    ```bash
    cd backend
    ./mvnw clean install
    ./mvnw spring-boot:run
    ```

    The backend will run on `http://localhost:8080`.

3. **Frontend Setup**

    Navigate to the `frontend` directory and install the required npm packages:

    ```bash
    cd frontend
    npm install
    ```

    Then, start the React development server:

    ```bash
    npm start
    ```

    The frontend will run on `http://localhost:3000`.

4. **Access the Application**

    Open your browser and navigate to `http://localhost:3000` to use the chat application.

## Future Improvements

- Integrate a database for message storage.
- Add user authentication and authorization.
- Improve UI/UX and responsiveness.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Spring Boot Documentation: [Spring Boot](https://spring.io/projects/spring-boot)
- React.js Documentation: [React.js](https://reactjs.org/)
- SockJS Documentation: [SockJS](https://sockjs.github.io/sockjs-client/)
- STOMP Protocol: [STOMP](https://stomp.github.io/)
