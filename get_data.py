from db_connection import get_connection

def fetch_Users():
    connection = get_connection()

    if connection is None:
        print("No se pudo conectar a la base de datos.")
        return []

    cursor = None
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM veterinarios"
        cursor.execute(query)
        results = cursor.fetchall()

        for row in results:
            print(row)

    except Exception as err:
        print(f"Error: {err}")
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    fetch_Users()