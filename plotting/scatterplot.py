# simple script to create scatter plot
import pandas as pd
import matplotlib.pyplot as plt

# path to csv
csvpath = 'CSV/features.csv'

# load data
df = pd.read_csv(csvpath)

# choose two features
feature1 = 'year'
feature2 = 'rhythm.danceability'

# plot a scatter plot from the two features
plt.scatter(df[feature1], df[feature2])
plt.show()