# importing csv module
import csv
import os
# csv file name
filename = "./movies.csv"

# initializing the titles and rows list
fields = []
rows = []

def mapMovieRow(row):
    return {
     "epoch": row[0],
     "episode": row[1],
     "year": row[2],
     "leecher": row[3],
     "tags": row[4].split(" "),
     "title": row[5],
     "path": row[6].replace("../redesign-files","/home/pi/Videos",1)
    }

# reading csv file
with open(filename, 'r') as csvfile:
    # creating a csv reader object
    csvreader = csv.reader(csvfile)

    # extracting each data row one by one
    for row in csvreader:
        rows.append(mapMovieRow(row))

    # get total number of rows
    print("Total no. of rows: %d"%(csvreader.line_num))


print(rows[0])
