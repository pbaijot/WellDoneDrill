import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
SHEET_DIR = Path("data/geology/sheets/49-1-2_tavier-esneux")
POINTS_PATH = SHEET_DIR / "validation_points.json"
RESULTS_PATH = SHEET_DIR / "validation_results.json"


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=90) as response:
        return json.loads(response.read().decode("utf-8"))


def call_api(lat: float, lng: float) -> dict:
    params = urllib.parse.urlencode({
        "lat": lat,
        "lng": lng,
        "depth": 200,
        "radius": 1500,
        "samples": 9,
    })

    return fetch_json(f"{BASE_URL}/api/geology-section?{params}")


def summarize_layers(data: dict):
    layers = ((data.get("interpretedSection") or {}).get("layers") or [])

    return [
        {
            "name": layer.get("name"),
            "topM": layer.get("topM"),
            "bottomM": layer.get("bottomM"),
            "lambda": layer.get("thermalConductivityWmK"),
            "hydroClass": layer.get("hydroClass"),
            "confidence": layer.get("confidence"),
        }
        for layer in layers
    ]


def run():
    if not POINTS_PATH.exists():
        raise SystemExit(f"❌ Fichier introuvable : {POINTS_PATH}")

    source = json.loads(POINTS_PATH.read_text(encoding="utf-8"))
    results = []

    print("Validation surfaceClass Tavier–Esneux")
    print("Assure-toi que npm run dev tourne dans un autre terminal.")
    print()

    for point in source["points"]:
        point_id = point["id"]
        label = point["label"]

        try:
            data = call_api(point["lat"], point["lng"])
            knowledge = data.get("geologyKnowledge")
            surface_class = knowledge.get("surfaceClass") if knowledge else None

            ok_knowledge = (knowledge is not None) == bool(point["expectedKnowledge"])
            ok_surface = (
                point.get("expectedSurfaceClass") is None
                or surface_class == point.get("expectedSurfaceClass")
            )

            result = {
                "id": point_id,
                "label": label,
                "lat": point["lat"],
                "lng": point["lng"],
                "status": "ok" if ok_knowledge and ok_surface else "review",
                "expectedKnowledge": point["expectedKnowledge"],
                "hasKnowledge": knowledge is not None,
                "expectedSurfaceClass": point.get("expectedSurfaceClass"),
                "surfaceClass": surface_class,
                "apiVersion": data.get("version"),
                "regionalLabel": (data.get("regionalContext") or {}).get("label"),
                "knowledgeSheet": knowledge.get("sheetCode") if knowledge else None,
                "knowledgeName": knowledge.get("name") if knowledge else None,
                "layers": summarize_layers(data),
                "warnings": data.get("warnings", [])[:8],
                "diagnostics": data.get("diagnostics", [])[:8],
            }

            results.append(result)

            emoji = "✅" if result["status"] == "ok" else "⚠️"
            print(f"{emoji} {label} | knowledge={result['hasKnowledge']} | surfaceClass={surface_class}")

        except Exception as exc:
            results.append({
                "id": point_id,
                "label": label,
                "lat": point["lat"],
                "lng": point["lng"],
                "status": "error",
                "error": str(exc),
            })
            print(f"❌ {label} | {exc}")

    output = {
        "sheetId": source["sheetId"],
        "sheetCode": source["sheetCode"],
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "results": results,
        "summary": {
            "count": len(results),
            "ok": sum(1 for r in results if r.get("status") == "ok"),
            "review": sum(1 for r in results if r.get("status") == "review"),
            "error": sum(1 for r in results if r.get("status") == "error"),
            "surfaceClasses": sorted(set(
                r.get("surfaceClass")
                for r in results
                if r.get("surfaceClass")
            )),
        },
    }

    RESULTS_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print()
    print(f"✅ Résultats écrits dans {RESULTS_PATH}")
    print("Résumé :", output["summary"])

    if output["summary"]["error"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    run()
