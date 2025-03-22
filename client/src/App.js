import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000")
            .then(res => res.text())
            .then(data => setMessage(data));
    }, []);

    return (
        <div>
            <h1>React + Node.js App</h1>
            <p>Backend Message: {message}</p>
        </div>
    );
}

export default App;
