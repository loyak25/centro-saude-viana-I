from pathlib import Path
import json,re,qrcode
BASE_URL="https://centro-saude-viana-i.vercel.app/employee.html?id="
root=Path(__file__).parent
s=(root/"team-data.js").read_text(encoding="utf-8")
m=re.search(r"window\.teamMembers = (\[.*?\]);\s*\n\s*window\.teamCategories",s,re.S)
members=json.loads(m.group(1))
out=root/"qr-codes"; out.mkdir(exist_ok=True)
for old in out.glob("*.png"): old.unlink()
for p in members:
    safe=re.sub(r"[^A-Za-z0-9À-ÿ]+","_",p["name"]).strip("_")
    qrcode.make(BASE_URL+p["id"]).save(out/f"{p['id']}_{safe[:90]}.png")
print(f"Gerados {len(members)} QR codes em {out}")
