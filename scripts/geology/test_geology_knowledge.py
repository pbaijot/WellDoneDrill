import json
import sys
import urllib.request
from dataclasses import dataclass


BASE_URL = "http://localhost:3000"


@dataclass
class TestCase:
    name: str
    lat: float
    lng: float
    expect_wdd_knowledge: bool


TEST_CASES = [
    TestCase(
        name="Esneux - dans la carte 49/1-2 Tavier-Esneux",
        lat=50.535,
        lng=5.567,
        expect_wdd_knowledge=True,
    ),
    TestCase(
        name="Comblain-au-Pont - dans la carte 49/1-2 Tavier-Esneux",
        lat=50.474,
        lng=5.577,
        expect_wdd_knowledge=True,
    ),
    TestCase(
        name="Bruxelles - hors carte pilote",
        lat=50.8503,
        lng=4.3517,
        expect_wdd_knowledge=False,
    ),
]


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=60) as response:
        body = response.read().decode("utf-8")
        return json.loads(body)


def assert_true(condition: bool, message: str):
    if not condition:
        raise AssertionError(message)


def run_case(case: TestCase):
    url = (
        f"{BASE_URL}/api/geology-section"
        f"?lat={case.lat}"
        f"&lng={case.lng}"
        f"&depth=200"
        f"&radius=1500"
    )

    data = fetch_json(url)

    assert_true(data.get("status") == "ok", f"{case.name}: status != ok")
    assert_true(
        data.get("version") == "v1.7-spw-wdd-geology-knowledge",
        f"{case.name}: mauvaise version API: {data.get('version')}",
    )

    section = data.get("interpretedSection") or {}
    layers = section.get("layers") or []

    assert_true(len(layers) > 0, f"{case.name}: aucune couche géologique renvoyée")

    knowledge = data.get("geologyKnowledge")

    if case.expect_wdd_knowledge:
        assert_true(knowledge is not None, f"{case.name}: geologyKnowledge attendu mais absent")
        assert_true(
            knowledge.get("sheetId") == "49-1-2_tavier-esneux",
            f"{case.name}: mauvais sheetId: {knowledge.get('sheetId')}",
        )
        assert_true(
            "Tavier" in knowledge.get("name", ""),
            f"{case.name}: mauvais nom de carte: {knowledge.get('name')}",
        )

        layer_names = [layer.get("name", "") for layer in layers]
        assert_true(
            any("Calcaires" in name or "Grès" in name or "Schistes" in name for name in layer_names),
            f"{case.name}: les couches WDD ne semblent pas utilisées: {layer_names}",
        )
    else:
        assert_true(knowledge is None, f"{case.name}: geologyKnowledge devrait être null")

    print(f"✅ {case.name}")


def main():
    print("Tests API geologyKnowledge")
    print("Assurez-vous que `npm run dev` tourne dans un autre terminal.")
    print()

    failures = []

    for case in TEST_CASES:
        try:
            run_case(case)
        except Exception as exc:
            failures.append((case.name, str(exc)))
            print(f"❌ {case.name}: {exc}")

    print()

    if failures:
        print(f"{len(failures)} test(s) en échec.")
        sys.exit(1)

    print("Tous les tests geologyKnowledge sont OK.")


if __name__ == "__main__":
    main()
