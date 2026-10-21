# -*- coding: utf-8 -*-
"""fetch_osm.py <مشروع> "<نقطة البداية>" [نصف القطر بالمتر=450]
يجيب شوارع OpenStreetMap حول نقطة البداية ويكتب assets/map/osm.json + map.js (أمتار، الأصل = نقطة البداية).
بعده أضف بالـmap.js: route (نقاط بالمتر من node شوارع OSM) + iJ (أول انعطاف) + company، وعلّم الشارع المطلوب بـk:'silo'.
⚠️ أرقام قياس قوقل تراكمية · اطلب لقطة مقرّبة لنهاية المسار · «© OpenStreetMap» إلزامي."""
import json, math, os, sys, urllib.parse, urllib.request
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
P, Q = sys.argv[1], sys.argv[2]; RAD = float(sys.argv[3]) if len(sys.argv) > 3 else 450
UA = {"User-Agent": "opusgraphic-map/1.0"}
def get(url): return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read().decode("utf-8"))
g = get("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + urllib.parse.quote(Q))[0]
lat0, lon0 = float(g["lat"]), float(g["lon"]); print("البداية:", g["display_name"][:80], lat0, lon0)
dl, dn = RAD / 110540, RAD / (111320 * math.cos(math.radians(lat0)))
q = f'[out:json][timeout:50];way["highway"]({lat0-dl*1.4},{lon0-dn*1.4},{lat0+dl*0.6},{lon0+dn*0.6});out geom;'   # الإطار مايل لجهة المسار؟ عدّل الأوزان
d = get("https://overpass-api.de/api/interpreter?data=" + urllib.parse.quote(q))
os.makedirs(os.path.join(P, "assets", "map"), exist_ok=True)
json.dump(d, open(os.path.join(P, "assets", "map", "osm.json"), "w", encoding="utf-8"))
def xy(p): return [round((p["lon"] - lon0) * math.cos(math.radians(lat0)) * 111320, 1), round((p["lat"] - lat0) * 110540, 1)]
roads = [{"k": "main" if e["tags"]["highway"] in ("primary", "secondary", "secondary_link", "trunk") else
          ("res" if e["tags"]["highway"] in ("residential", "tertiary", "unclassified") else "svc"),
          "id": e["id"], "name": e["tags"].get("name", ""), "p": [xy(p) for p in e["geometry"]]} for e in d["elements"]]
M = {"roads": roads, "route": [[0, 0]], "iJ": 0, "company": [0, 0], "origin": [lat0, lon0], "attr": "© OpenStreetMap"}
open(os.path.join(P, "assets", "map", "map.js"), "w", encoding="utf-8").write("window.MAPD=" + json.dumps(M, ensure_ascii=False) + ";")
print(len(roads), "شارع ← assets/map/map.js (عبّي route/iJ/company)")
