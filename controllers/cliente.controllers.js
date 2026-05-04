import Cliente from "../models/cliente.js";

//POST 
export const crearCliente = async (req, res) => {
    try {
        const clienteNuevo = new Cliente(req.body);
        await clienteNuevo.save();
        const clienteGuardado = await Cliente.findById(clienteNuevo._id);
        res.status(201).json(clienteGuardado)
    
   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error en el servidor al crear el cliente",
        });
    }
};


//get

export const obtenerClientes = async (req, res) => {
    try {
        const { identificador } = req.query;
        const filtro = {};
        if (identificador) {
            filtro.identificador = { $regex: identificador, $options: "i" };
        }
        
        const obtenerCliente = await Cliente.find(filtro);


        const clienteTransformado = obtenerCliente.map((cliente) => ({
            _id: cliente._id,
            nombre: cliente.nombre,
            identificador: cliente.identificador,
            email: cliente.email,
            telefono: cliente.telefono,
            estadoCliente: cliente.estadoCliente,
        }));

        res.status(200).json(clienteTransformado);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener la lista de clientes"
        });
    };
};


    //get por id
    export const obtenerClientePorId = async (req, res) => {
        try {
            const listarClientePorId = await Cliente.findById(req.params.id);
            if (!listarClientePorId) {
                return res.status(404).json({
                    message: "El cliente con ese ID no existe"
                });
            }
            const clienteTransformado = {
                _id: listarClientePorId._id,
                nombre: listarClientePorId.nombre,
                identificador: listarClientePorId.identificador,
                email: listarClientePorId.email,
                telefono: listarClientePorId.telefono,
                estadoCliente: listarClientePorId.estadoCliente,
            };
            res.status(200).json(clienteTransformado);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error al obtener el cliente por ID"
            })
        }
    };

    //delete
    export const eliminarCliente = async (req, res) => {
        try {
            const clienteBorrado = await Cliente.findByIdAndDelete(req.params.id);
            if (!clienteBorrado) {
                return res.status(404).json({
                    message: "El cliente con ese ID no existe"
                })
            }
            res.status(200).json({
                message: "Cliente eliminado con exito"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error al borrar el cliente por ID"
            })
        }
    };

    // update

    export const editarCliente = async (req, res) => {
        try {
            const clienteEditado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!clienteEditado) {
                return res.status(400).json({
                    message: "El cliente con ese ID no existe"
                })
            };
            res.status(200).json(
                clienteEditado
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error al actualizar el cliente por ID"
            });
        }
    };
