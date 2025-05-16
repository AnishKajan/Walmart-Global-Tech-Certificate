import csv
import sqlite3

# Connect to the database
conn = sqlite3.connect("shipment.db")
cur = conn.cursor()

# Insert spreadsheet0 directly
with open("spreadsheet0.csv", newline='') as file0:
    reader = csv.DictReader(file0)
    for row in reader:
        cur.execute("""
            INSERT INTO shipment_product (shipment_id, product_name, quantity)
            VALUES (?, ?, ?)
        """, (row["shipment_id"], row["product_name"], row["quantity"]))

# Load spreadsheet2 into a dictionary for fast lookup
location_lookup = {}
with open("spreadsheet2.csv", newline='') as file2:
    reader = csv.DictReader(file2)
    for row in reader:
        shipment_id = row["shipment_id"]
        location_lookup[shipment_id] = (row["origin"], row["destination"])

# Process spreadsheet1 and cross-reference with spreadsheet2
shipment_products = {}
with open("spreadsheet1.csv", newline='') as file1:
    reader = csv.DictReader(file1)
    for row in reader:
        shipment_id = row["shipment_id"]
        product = row["product_name"]

        if shipment_id not in shipment_products:
            shipment_products[shipment_id] = {}

        if product not in shipment_products[shipment_id]:
            shipment_products[shipment_id][product] = 0

        shipment_products[shipment_id][product] += 1

# Insert results into shipment and shipment_product
for shipment_id, products in shipment_products.items():
    origin, destination = location_lookup[shipment_id]

    # Insert shipment
    cur.execute("""
        INSERT INTO shipment (id, origin, destination)
        VALUES (?, ?, ?)
    """, (shipment_id, origin, destination))

    # Insert each product in that shipment
    for product, quantity in products.items():
        cur.execute("""
            INSERT INTO shipment_product (shipment_id, product_name, quantity)
            VALUES (?, ?, ?)
        """, (shipment_id, product, quantity))

conn.commit()
conn.close()
print("✅ Data inserted successfully.")
