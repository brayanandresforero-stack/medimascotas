import tkinter as tk
from tkinter import messagebox
from db_connection import get_connection
#registro interfaz de veterinario#
def registrar_veterinario():
    id_vet = entry_id.get().strip()
    nombre = entry_nombre.get().strip()
    apellido = entry_apellido.get().strip()
    fecha_nac = entry_fecha.get().strip()  
    titulo = entry_titulo.get().strip()
    especialidad = entry_especialidad.get().strip()

    if not id_vet or not nombre or not apellido:
        messagebox.showwarning("Campos Requeridos", "ID, Nombre y Apellido")
        return

    connection = get_connection()
    if connection is None:
        messagebox.showerror("Error de Conexión", "No se pudo conectar a MySQL.")
        return

    cursor = None
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO veterinarios (IDVeterinario, Nombre, Apellido, FechaNacimiento, Titulo, Especialidad) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        #campos vacios pasan a null#
        val_fecha = fecha_nac if fecha_nac else None
        val_titulo = titulo if titulo else None
        val_especialidad = especialidad if especialidad else None

        cursor.execute(query, (id_vet, nombre, apellido, val_fecha, val_titulo, val_especialidad))
        connection.commit()

        messagebox.showinfo("se registró correctamente.")
        limpiar_campos()

    except Exception as err:
        messagebox.showerror("Error SQL", f"No se pudo guardar el registro:\n{err}")
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def limpiar_campos():
    entry_id.delete(0, tk.END)
    entry_nombre.delete(0, tk.END)
    entry_apellido.delete(0, tk.END)
    entry_fecha.delete(0, tk.END)
    entry_titulo.delete(0, tk.END)
    entry_especialidad.delete(0, tk.END)

#Interfaz#
app = tk.Tk()
app.title("Registro de Veterinarios - MediMascotas")
app.geometry("400x520")
app.resizable(False, False)

lbl_titulo = tk.Label(app, text="Registro de Veterinario", font=("Arial", 14, "bold"))
lbl_titulo.pack(pady=10)

frame = tk.Frame(app)
frame.pack(padx=20, pady=5)

# IDVeterinario
tk.Label(frame, text="ID Veterinario:*").grid(row=0, column=0, sticky="w", pady=2)
entry_id = tk.Entry(frame, width=35)
entry_id.grid(row=1, column=0, pady=4)

# Nombre
tk.Label(frame, text="Nombre:*").grid(row=2, column=0, sticky="w", pady=2)
entry_nombre = tk.Entry(frame, width=35)
entry_nombre.grid(row=3, column=0, pady=4)

# Apellido
tk.Label(frame, text="Apellido:*").grid(row=4, column=0, sticky="w", pady=2)
entry_apellido = tk.Entry(frame, width=35)
entry_apellido.grid(row=5, column=0, pady=4)

# FechaNacimiento
tk.Label(frame, text="Fecha Nacimiento (AAAA-MM-DD):").grid(row=6, column=0, sticky="w", pady=2)
entry_fecha = tk.Entry(frame, width=35)
entry_fecha.grid(row=7, column=0, pady=4)

# Titulo
tk.Label(frame, text="Título:").grid(row=8, column=0, sticky="w", pady=2)
entry_titulo = tk.Entry(frame, width=35)
entry_titulo.grid(row=9, column=0, pady=4)

# Especialidad
tk.Label(frame, text="Especialidad:").grid(row=10, column=0, sticky="w", pady=2)
entry_especialidad = tk.Entry(frame, width=35)
entry_especialidad.grid(row=11, column=0, pady=4)

# Botón
btn_registrar = tk.Button(
    app, 
    text="Guardar en Base de Datos", 
    bg="#28a745", 
    fg="white", 
    font=("Arial", 10, "bold"), 
    command=registrar_veterinario
)
btn_registrar.pack(pady=15)

app.mainloop()