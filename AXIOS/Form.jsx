import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Form() {
    const [formData, setFormData] = useState({ name: "" });
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/data")
            .then((response) => setUserData(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const newID = Date.now().toString();
        axios
            .post("http://localhost:3000/data", { ...formData, id: newID })
            .then((response) => {
                setUserData((prevData) => [...prevData, response.data]);
                setFormData({ name: "" });
            })
            .catch((error) => console.error("Error submitting data:", error));
    }

    function handleDelete(id) {
        axios
            .delete(`http://localhost:3000/data/${id}`)
            .then(() => {
                setUserData((prevData) => prevData.filter((item) => item.id !== id));
            })
            .catch((error) => console.error("Error deleting data:", error));
    }

    function handleEdit(id) {
        const newValue = prompt("Enter the new value:");
        if (newValue) {
            axios
                .put(`http://localhost:3000/data/${id}`, { id, name: newValue })
                .then((response) => {
                    setUserData((prevData) =>
                        prevData.map((item) =>
                            item.id === id ? response.data : item
                        )
                    );
                })
                .catch((error) => console.error("Error editing data:", error));
        }
    }

    return (
        <div>
            <br />
            <h1>Fatch .json Data using Axios</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={formData.name}
                    placeholder="Enter the name"
                    onChange={(e) => setFormData({ name: e.target.value })}
                />{" "}
                &nbsp;
                <button type="submit">Submit</button>
            </form>
            <br />
            <br />

            <ul style={{ listStyle: "none" }}>
                {userData.map((user) => (
                    <li key={user.id}>
                        {user.name}{" "}
                        <button type="button" onClick={() => handleDelete(user.id)}>
                            Delete
                        </button>
                        &nbsp;&nbsp;
                        <button type="button" onClick={() => handleEdit(user.id)}>
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}