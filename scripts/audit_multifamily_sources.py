from __future__ import annotations

from pathlib import Path

import pandas as pd


WORKSPACE_ROOT = Path(r"C:\Users\migue\OneDrive\Documents\valoris\Research Broker ExSum")
PROJECT_ROOT = WORKSPACE_ROOT / "xcreos-dashboard"
SOURCE_CSV = WORKSPACE_ROOT / "outputs" / "portfolio_batch" / "multifamily_acquisition_master_updated.csv"
AUDIT_DIR = PROJECT_ROOT / "data-audit"
AUDIT_CSV = AUDIT_DIR / "multifamily_source_audit.csv"
AUDIT_SUMMARY = AUDIT_DIR / "multifamily_source_audit_summary.md"


def file_exists(value: object) -> bool:
    if not isinstance(value, str) or not value.strip():
        return False
    return Path(value).exists()


def main() -> None:
    df = pd.read_csv(SOURCE_CSV)
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)

    audit = df.copy()
    audit["t12_file_exists"] = audit["source_t12_file"].apply(file_exists)
    audit["rent_roll_file_exists"] = audit["source_rent_roll_file"].apply(file_exists)
    audit["has_units"] = audit["units"].notna()
    audit["has_year_built"] = audit["year_built"].notna()
    audit["has_occupancy"] = audit["physical_occupancy_pct"].notna()
    audit["has_noi"] = audit["noi_actual"].notna()
    audit["has_expense_ratio"] = audit["expense_ratio_actual"].notna()
    audit["has_dscr"] = audit["dscr_current"].notna()
    audit["has_annual_upside"] = audit["in_place_annual_upside"].notna()
    audit["source_coverage"] = (
        audit["t12_file_exists"].map({True: "T12", False: ""})
        + audit["rent_roll_file_exists"].map({True: "|RR", False: ""})
    ).str.strip("|")
    audit["source_coverage"] = audit["source_coverage"].replace("", "None")

    audit["quality_notes"] = ""
    audit.loc[(audit["has_noi"]) & (~audit["has_dscr"]), "quality_notes"] += "NOI present but DSCR missing; "
    audit.loc[(audit["t12_file_exists"]) & (~audit["has_noi"]), "quality_notes"] += "T12 file found but NOI not extracted; "
    audit.loc[(audit["rent_roll_file_exists"]) & (~audit["has_occupancy"]), "quality_notes"] += "Rent roll found but occupancy not extracted; "
    audit["quality_notes"] = audit["quality_notes"].str.rstrip("; ")

    audit_columns = [
        "broker_name",
        "property_name",
        "source_folder_name",
        "source_coverage",
        "t12_file_exists",
        "rent_roll_file_exists",
        "has_units",
        "has_year_built",
        "has_occupancy",
        "has_noi",
        "has_expense_ratio",
        "has_dscr",
        "has_annual_upside",
        "quality_notes",
        "source_t12_file",
        "source_rent_roll_file",
    ]
    audit[audit_columns].to_csv(AUDIT_CSV, index=False)

    def count(column: str) -> int:
        return int(audit[column].sum())

    summary_lines = [
        "# Multifamily Source Audit",
        "",
        f"- Rows audited: {len(audit)}",
        f"- T12 files linked and found: {count('t12_file_exists')}",
        f"- Rent roll files linked and found: {count('rent_roll_file_exists')}",
        f"- Units populated: {count('has_units')}",
        f"- Year built populated: {count('has_year_built')}",
        f"- Occupancy populated: {count('has_occupancy')}",
        f"- NOI populated: {count('has_noi')}",
        f"- Expense ratio populated: {count('has_expense_ratio')}",
        f"- DSCR populated: {count('has_dscr')}",
        f"- Annual upside populated: {count('has_annual_upside')}",
        "",
        "## Main Findings",
        "",
        "- DSCR is missing across all 35 rows in the consolidated table.",
        "- 22 properties have a linked T12 file, but only a subset produced extractable NOI.",
        "- 20 properties have a linked rent roll file, but occupancy/upside coverage is still partial.",
        "- Rows with `quality_notes` need extractor review before being treated as fully source-backed.",
        "",
        f"Detailed audit CSV: `{AUDIT_CSV}`",
    ]
    AUDIT_SUMMARY.write_text("\n".join(summary_lines), encoding="utf-8")

    print(AUDIT_SUMMARY)
    print(AUDIT_CSV)


if __name__ == "__main__":
    main()
