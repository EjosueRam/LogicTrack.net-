import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeHuGenerated, getHuGenerated, updateHuGenerated, deleteHuGenerated } from "../api/Hu_generated.api.js";
import { toast } from "react-hot-toast";
import getUserFullName from "@/components/UserInfo.jsx";


const HuGeneratedForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userName = getUserFullName();

    const [formData, setFormData] = useState({
        huGenerated: '',
        hu: '',
        material: '',
        person: userName,
        reason: '',
        requester: '',
        huByGenerated: ''
    });

    // Fetch data if id is present
    useEffect(() => {
        if (id) {
            const fetchHuGenerated = async () => {
                try {
                    const res = await getHuGenerated(id);
                    setFormData(res.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast.error("Error al cargar los datos", {
                        position: "bottom-right",
                        style: {
                            background: "#101010",
                            color: "#fff",
                        },
                    });
                }
            };
            fetchHuGenerated();
        }
    }, [id]);

    // Handle input change and validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'reason' || name === 'requester') {
            const regex = /^[a-zA-Z0-9\s]*$/;
            if (!regex.test(value)) {
                toast.error("Solo se permiten letras y números", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                return;
            }
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            ...(name === 'huGenerated' && {
                hu: value.slice(0, 20),
                material: value.slice(29, 39)
            })
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.reason || !formData.requester) {
            toast.error("Los campos 'Motivo' y 'Solicitante' son obligatorios", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            return;
        }
        try {
            if (id) {
                await updateHuGenerated(id, formData);
                toast.success("Escaneo actualizado", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
            } else {
                await makeHuGenerated(formData);
                toast.success("Escaneo agregado", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
            }
            navigate("/HuGenerated-form");
        } catch (error) {
            console.error("Error al registrar los datos:", error);
            toast.error("Hubo un error al guardar los escaneos", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
        }
    };

    // Handle delete
    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de eliminar este escaneo?");
        if (confirmDelete) {
            try {
                await deleteHuGenerated(id);
                toast.success("Escaneo eliminado", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                navigate("/HuGenerated");
            } catch (error) {
                console.error("Error al eliminar los datos:", error);
                toast.error("Error al eliminar los datos", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
            }
        }
    };

    return (
        <div className="bg-white min-h-screen w-full">
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-6">{id ? "Actualizar Hu Generada" : "Registrar Hu Generada"}</h1>
                <form className="bg-white p-4 w-full max-w-full" onSubmit={handleSubmit}>
                    {/* HU Generada */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="huGenerated">
                            Hu Generada:
                        </label>
                        <input
                            type="text"
                            id="huGenerated"
                            name="huGenerated"
                            value={formData.huGenerated}
                            onChange={handleChange}
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    {/* HU */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hu">
                            Hu:
                        </label>
                        <input
                            type="text"
                            id="hu"
                            name="hu"
                            value={formData.hu}
                            readOnly
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    {/* Material */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="material">
                            Material:
                        </label>
                        <input
                            type="text"
                            id="material"
                            name="material"
                            value={formData.material}
                            readOnly
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    {/* Persona que la generó */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="person">
                            Persona que la generó:
                        </label>
                        <input
                            type="text"
                            id="person"
                            name="person"
                            value={formData.person}
                            readOnly
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    {/* Motivo */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                            Motivo:
                        </label>
                        <input
                            type="text"
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requester">
                            Solicitante:
                        </label>
                        <input
                            type="text"
                            id="requester"
                            name="requester"
                            value={formData.requester}
                            onChange={handleChange}
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                            required
                        />
                    </div>

                    {/* Hu por la que se generó */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="huByGenerated">
                            Hu por la que se generó (opcional):
                        </label>
                        <input
                            type="text"
                            id="huByGenerated"
                            name="huByGenerated"
                            value={formData.huByGenerated}
                            onChange={handleChange}
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    {/* Submit and Delete Buttons */}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {id ? 'Actualizar' : 'Registrar'}
                    </button>

                    {id && (
                        <button
                            onClick={handleDelete}
                            type="button"
                            className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default HuGeneratedForm;