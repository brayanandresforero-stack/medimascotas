import os
import shutil
from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from db_connection import get_connection

app = FastAPI(title="Portal de Compras - Veterinaria MediMascotas")

# Carpeta donde se guardan las imágenes subidas de los productos
CARPETA_IMAGENES = "imagenes_productos"
os.makedirs(CARPETA_IMAGENES, exist_ok=True)
app.mount("/imagenes", StaticFiles(directory=CARPETA_IMAGENES), name="imagenes")


# ============================================================
# ENDPOINT: Obtener medicamentos + inventario (JSON)
# ============================================================
@app.get("/api/productos")
def get_productos():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")

    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT
                m.IDMedicamentos,
                m.NombreMedicamento,
                m.TipoMedicamento,
                m.Descripcion,
                i.Cantidad,
                i.Precio
            FROM medicamentos m
            LEFT JOIN inventario i ON m.IDMedicamentos = i.IDMedicamentos
        """
        cursor.execute(query)
        results = cursor.fetchall()

        # Agregar la ruta de la imagen si existe en la carpeta local
        for producto in results:
            id_med = producto["IDMedicamentos"]
            encontrada = None
            for ext in ["jpg", "jpeg", "png", "webp"]:
                posible = os.path.join(CARPETA_IMAGENES, f"{id_med}.{ext}")
                if os.path.exists(posible):
                    encontrada = f"/imagenes/{id_med}.{ext}"
                    break
            producto["Imagen"] = encontrada

        return {"ok": True, "data": results}
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ============================================================
# ENDPOINT: Registro de usuario (dueño de mascota)
# ============================================================
@app.get("/registro-usuario", response_class=HTMLResponse)
def formulario_registro_usuario():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro de Usuario - MediMascotas</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
            .card { max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { text-align: center; color: #333; margin-top: 0; }
            label { font-weight: bold; font-size: 14px; display: block; margin-top: 12px; }
            input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 12px; background: #27ae60; color: white; font-weight: bold; border: none; border-radius: 4px; margin-top: 20px; cursor: pointer; }
            button:hover { background: #1e8449; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Registro de Usuario</h2>
            <form action="/registro-usuario" method="post">
                <label>Nombre:*</label>
                <input type="text" name="nombre" required>

                <label>Apellido:*</label>
                <input type="text" name="apellido" required>

                <label>Dirección:</label>
                <input type="text" name="direccion">

                <label>Teléfono:*</label>
                <input type="text" name="telefono" required>

                <button type="submit">Registrarme</button>
            </form>
        </div>
    </body>
    </html>
    """


@app.post("/registro-usuario", response_class=HTMLResponse)
def procesar_registro_usuario(
    nombre: str = Form(...),
    apellido: str = Form(...),
    direccion: str = Form(None),
    telefono: str = Form(...)
):
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")

    cursor = None
    try:
        cursor = connection.cursor()

        # La tabla dueñomascota no tiene auto-incremento, calculamos el siguiente ID
        cursor.execute("SELECT COALESCE(MAX(IdDueño), 0) + 1 FROM dueñomascota")
        nuevo_id = cursor.fetchone()[0]

        query = """
            INSERT INTO dueñomascota (IdDueño, Nombre, Apellido, Direccion, Telefono)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nuevo_id, nombre, apellido, direccion, telefono))
        connection.commit()

        return """
            <script>
                alert('¡Registro exitoso!');
                window.location.href = '/portal-compras';
            </script>
        """
    except Exception as err:
        return f"<p style='color:red;'>Error al registrar: {err}</p><a href='/registro-usuario'>Volver</a>"
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ============================================================
# ENDPOINT: Formulario para subir imagen de un producto
# ============================================================
@app.get("/subir-imagen", response_class=HTMLResponse)
def formulario_subir_imagen():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Subir Imagen de Producto</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
            .card { max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { text-align: center; color: #333; margin-top: 0; }
            label { font-weight: bold; font-size: 14px; display: block; margin-top: 12px; }
            input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 12px; background: #2980b9; color: white; font-weight: bold; border: none; border-radius: 4px; margin-top: 20px; cursor: pointer; }
            button:hover { background: #2471a3; }
            .ayuda { font-size: 12px; color: #888; margin-top: 4px; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Subir Imagen de Producto</h2>
            <form action="/subir-imagen" method="post" enctype="multipart/form-data">
                <label>ID del Medicamento:*</label>
                <input type="number" name="id_medicamento" required>
                <div class="ayuda">Consulta el ID en /api/productos</div>

                <label>Selecciona la imagen:*</label>
                <input type="file" name="imagen" accept="image/*" required>

                <button type="submit">Subir imagen</button>
            </form>
        </div>
    </body>
    </html>
    """


@app.post("/subir-imagen")
async def procesar_subida_imagen(id_medicamento: int = Form(...), imagen: UploadFile = File(...)):
    extension = imagen.filename.split(".")[-1]
    nombre_archivo = f"{id_medicamento}.{extension}"
    ruta_destino = os.path.join(CARPETA_IMAGENES, nombre_archivo)

    try:
        with open(ruta_destino, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Error al guardar la imagen: {err}")

    return HTMLResponse(f"""
        <script>
            alert('Imagen subida correctamente para el producto {id_medicamento}');
            window.location.href = '/portal-compras';
        </script>
    """)


# ============================================================
# PORTAL DE COMPRAS (interfaz visual tipo tienda)
# ============================================================
@app.get("/portal-compras", response_class=HTMLResponse)
def portal_compras():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portal de Compras - Veterinaria MediMascotas</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
            header { background: #27ae60; color: white; padding: 20px; text-align: center; }
            header a { color: white; text-decoration: none; margin-left: 20px; font-size: 14px; }
            .container { max-width: 1100px; margin: auto; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
            .producto { background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 15px; text-align: center; }
            .producto img { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; background: #ddd; }
            .producto h3 { font-size: 16px; margin: 10px 0 5px; }
            .producto p { font-size: 13px; color: #666; margin: 4px 0; }
            .precio { font-size: 18px; font-weight: bold; color: #27ae60; margin: 8px 0; }
            .stock { font-size: 12px; color: #999; }
            .agotado { color: #e74c3c; font-weight: bold; }
            button.comprar { width: 100%; padding: 8px; background: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px; }
            button.comprar:hover { background: #2471a3; }
            button.comprar:disabled { background: #bbb; cursor: not-allowed; }
            #carrito { position: fixed; bottom: 0; right: 0; background: #2c3e50; color: white; padding: 15px 25px; border-radius: 8px 0 0 0; }
        </style>
    </head>
    <body>
        <header>
            <h1>🐾 Portal de Compras - Veterinaria MediMascotas</h1>
            <a href="/registro-usuario">Registrarme</a>
            <a href="/subir-imagen">Subir imagen de producto</a>
        </header>

        <div class="container">
            <div id="grid" class="grid">
                <p>Cargando productos...</p>
            </div>
        </div>

        <div id="carrito">🛒 Carrito: <span id="totalCarrito">0</span> producto(s)</div>

        <script>
            let carrito = 0;

            async function cargarProductos() {
                try {
                    const res = await fetch('/api/productos');
                    const json = await res.json();
                    const grid = document.getElementById('grid');
                    grid.innerHTML = '';

                    if (json.ok && json.data.length > 0) {
                        json.data.forEach(p => {
                            const stock = p.Cantidad || 0;
                            const precio = p.Precio ? `$${Number(p.Precio).toLocaleString()}` : 'N/A';
                            const disponible = stock > 0;
                            const imagenSrc = p.Imagen ? p.Imagen : `https://via.placeholder.com/240x140?text=${encodeURIComponent(p.NombreMedicamento)}`;

                            grid.innerHTML += `
                                <div class="producto">
                                    <img src="${imagenSrc}" alt="${p.NombreMedicamento}">
                                    <h3>${p.NombreMedicamento}</h3>
                                    <p>${p.TipoMedicamento || ''}</p>
                                    <div class="precio">${precio}</div>
                                    <div class="stock ${!disponible ? 'agotado' : ''}">
                                        ${disponible ? `Stock: ${stock}` : 'Agotado'}
                                    </div>
                                    <button class="comprar" ${!disponible ? 'disabled' : ''} onclick="agregarCarrito('${p.NombreMedicamento}')">
                                        ${disponible ? 'Agregar al carrito' : 'No disponible'}
                                    </button>
                                </div>
                            `;
                        });
                    } else {
                        grid.innerHTML = '<p>No hay productos disponibles por el momento.</p>';
                    }
                } catch (error) {
                    document.getElementById('grid').innerHTML = '<p style="color:red;">Error al cargar los productos.</p>';
                    console.error(error);
                }
            }

            function agregarCarrito(nombre) {
                carrito++;
                document.getElementById('totalCarrito').innerText = carrito;
                alert(`"${nombre}" agregado al carrito. (Pasarela de pago simulada — próximamente integración real)`);
            }

            cargarProductos();
        </script>
    </body>
    </html>
    """

