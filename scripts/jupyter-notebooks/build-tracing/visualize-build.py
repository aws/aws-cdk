# %%
from pathlib import Path
import csv

trace_dir = Path(__file__).parent / '..' / '..' / '..' / '.traces'

rows = []
for file in trace_dir.glob('*'):
  with open(file) as f:
    reader = csv.reader(f)
    for row in reader:
      if not row: continue
      rows.append(dict(
        command=row[0],
        package=row[1],
        start=int(row[2]),
        end=int(row[3]),
        mem=float(row[4]),
      ))

print(rows)
# %%
