import pdfplumber
import psycopg2
import re

conn = psycopg2.connect(
    host="localhost",
    database="Mport",        # ← nome do seu banco no pgAdmin
    user="postgres",          # ← seu usuário do pgAdmin
    password="140625"      # ← sua senha do PostgreSQL
)
cur = conn.cursor()

registros = []

with pdfplumber.open("arancel2026.pdf") as pdf:
    for page in pdf.pages[20:]:
        text = page.extract_text()
        if not text:
            continue
        for line in text.split('\n'):
            match = re.match(r'^(\d{4}\.\d{2}\.\d{2}\.\d{2})\s+(.+?)\s+(\d+)\s', line)
            if match:
                codigo = match.group(1)
                descricao = match.group(2).strip()
                ga = float(match.group(3))
                if ga <=9999: #ignora valores claramente errados
                    registros.append((codigo, descricao, ga))

for r in registros:
    cur.execute("""
        INSERT INTO arancel (codigo, descripcion, ga_porcentaje)
        VALUES (%s, %s, %s)
        ON CONFLICT DO NOTHING
    """, r)

conn.commit()
cur.close()
conn.close()
print(f"{len(registros)} registros importados com sucesso!")