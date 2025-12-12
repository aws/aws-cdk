# To use this script, install the `Jupyter` extension for VS Code, create a
# virtual environment and install `requirements.txt`, then select the virtual
# env in VS Code.

# %%
from pathlib import Path
import csv
from plotnine import *
import pandas as pd
from itertools import groupby

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

# Convert rows to DataFrame
df = pd.DataFrame(rows)

# Create Gantt chart
gantt = (ggplot(df, aes(xmin='start', xmax='end', y='package', fill='command'))
         + geom_segment(aes(x='start', xend='end', y='package', yend='package'), size=8)
#         + geom_rect(aes(x='start', xend='end', ymin='package', ymax='package'), size=8)
         + labs(title='Package Build Timeline', x='Time', y='Package')
         + theme(figure_size=(12, 6))
         + scale_x_datetime(date_labels='%H:%M:%S')
)

gantt.show()

# Calculate memory usage
mem_mut = []
for row in rows:
  mem_mut.append((row['start'], row['mem']))
  mem_mut.append((row['end'], -row['mem']))
mem_mut.sort(key=lambda x: x[0])

mem_timeline = []
for (t, mem_delta) in mem_mut:
  if mem_timeline:
    mem_timeline.append(dict(t=t, mem=mem_timeline[-1]['mem'] + mem_delta))
  else:
    mem_timeline.append(dict(t=t, mem=mem_delta))

mem_plot = (ggplot(pd.DataFrame(mem_timeline), aes(x='t', y='mem'))
  + geom_line()
  + labs(title='Memory Usage Timeline', x='Time', y='Memory Used (MB)')
  + scale_x_datetime(date_labels='%H:%M:%S')
)

mem_plot.show()

# Avg Memory Usage by command
print('Avg Memory Usage by command')
print(df.groupby('command')['mem'].mean().sort_values(ascending=False))

# Avg Memory Usage by command  that is not for aws-cdk-lib
print('Avg Memory Usage by command, except aws-cdk-lib')
non_cdk_lib = df[df['package'] != 'aws-cdk-lib']
print(non_cdk_lib.groupby('command')['mem'].mean().sort_values(ascending=False))

# Avg Memory usage by package
print('Avg Memory Usage by package')
print(df.groupby('package')['mem'].mean().sort_values(ascending=False))


# %%
