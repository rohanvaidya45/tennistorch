import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime


class ATPDataLoader:
    """Loader for Jeff Sackmann's ATP tennis dataset"""

    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def load_matches(
        self, year: Optional[int] = None, start_year: int = 1968, end_year: int = 2024
    ) -> pd.DataFrame:
        """Load ATP match data for specified year(s)"""
        if year:
            return self._load_single_year(year)

        dfs = []
        for year in range(start_year, end_year + 1):
            try:
                df = self._load_single_year(year)
                dfs.append(df)
            except FileNotFoundError:
                print(f"Warning: No data found for {year}")
                continue

        return pd.concat(dfs, ignore_index=True)

    def _load_single_year(self, year: int) -> pd.DataFrame:
        """Load single year of ATP match data"""
        file_path = self.data_path / f"atp_matches_{year}.csv"
        return pd.read_csv(file_path)

    def load_player_data(self) -> pd.DataFrame:
        """Load player biographical data"""
        file_path = self.data_path / "atp_players.csv"
        return pd.read_csv(file_path)
