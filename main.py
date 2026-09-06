from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import HTMLResponse
from db_connection import get_connection

app = FastAPI(title="API MediMascotas")

# Formulario HTML responsive accesible desde navegadores web
@app.get("/registro", response_class=HTMLResponse)
def formulario_registro():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro Veterinario - MediMascotas</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
            .card { max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { text-align: center; color: #333; margin-top: 0; }
            label { font-weight: bold; font-size: 14px; display: block; margin-top: 12px; }
            input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 12px; background: #28a745; color: white; font-weight: bold; border: none; border-radius: 4px; margin-top: 20px; cursor: pointer; }
            button:hover { background: #218838; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Registro de Veterinarios</h2>
            <form action="/registro" method="post">
                <label>ID Veterinario:*</label>
                <input type="number" name="id_vet" required>
                
                <label>Nombre:*</label>
                <input type="text" name="nombre" required>
                
                <label>Apellido:*</label>
                <input type="text" name="apellido" required>
                
                <label>Fecha Nacimiento (AAAA-MM-DD):</label>
                <input type="date" name="fecha_nac">
                
                <label>Título:</label>
                <input type="text" name="titulo">
                
                <label>Especialidad:</label>
                <input type="text" name="especialidad">
                
                <button type="submit">Guardar en Base de Datos</button>
            </form>
        </div>
    </body>
    </html>
    """

# Procesar el envío del formulario
@app.post("/registro", response_class=HTMLResponse)
def procesar_registro(
    id_vet: int = Form(...),
    nombre: str = Form(...),
    apellido: str = Form(...),
    fecha_nac: str = Form(None),
    titulo: str = Form(None),
    especialidad: str = Form(None)
):
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")

    cursor = None
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO veterinarios (IDVeterinario, Nombre, Apellido, FechaNacimiento, Titulo, Especialidad) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        val_fecha = fecha_nac if fecha_nac else None
        val_titulo = titulo if titulo else None
        val_especialidad = especialidad if especialidad else None

        cursor.execute(query, (id_vet, nombre, apellido, val_fecha, val_titulo, val_especialidad))
        connection.commit()

        return """
            <script>
                alert('¡Veterinario registrado con éxito!');
                window.location.href = '/registro';
            </script>
        """
    except Exception as err:
        return f"<p style='color:red;'>Error al guardar: {err}</p><a href='/registro'>Volver</a>"
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# Endpoint para listar datos en JSON
@app.get("/veterinarios")
def get_veterinarios():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM veterinarios")
        results = cursor.fetchall()
        return {"data": results}
    finally:
        cursor.close()
        connection.close()