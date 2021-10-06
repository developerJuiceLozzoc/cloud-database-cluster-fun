# importing csv module
import csv
import os
# csv file name
filename = "./movies.csv"

# initializing the titles and rows list
fields = []
rows = []

def mapMovieRow(row):
    pipath = row[6].replace("../redesign-files","/home/pi/Videos",1)
    fstat = os.stat(pipath)
    return [row[0],row[2],row[5],row[1],row[3],"{}".format(fstat.st_size),pipath]

# reading csv file
with open(filename, 'r') as csvfile:
    # creating a csv reader object
    csvreader = csv.reader(csvfile)

    # extracting each data row one by one
    for row in csvreader:
        print(",".join(mapMovieRow(row)))
#        rows.append(mapMovieRow(row))

    # get total number of rows
    print("Total no. of rows: %d"%(csvreader.line_num))


