import os
import sys
import re

filetypes= [".mp4",".avi",".mkv"]

okaywhat = {}
foldername = "South Park"
tvname = foldername

def selectEpisodeAOT(arr,firstword):
    if firstword == "episode":
        return arr[0]
    else:
        return arr[1]
        
def selectEpisodeBB(arr):
    return arr[1]
    
def selectEpisodeOPM(arr,s):
    if s == 1:
        return arr[0]
    else:
        return arr[1]
#// maybe i need to list all the dirs first before doing anything with files
def moviefname_transform(fname):
    items = fname.split(" ")
    title = items[0]
    year = items[1]
    author = items[2]
    return title,year,author
    

def int_extractor_string(str):
    temp1 = re.findall(r'\d+', str) # find number of digits through regular expression
    return list(map(int, temp1))
    

def scan_season(dir,epoch):
    eps = []
    for f in os.scandir(dir):
        if f.name[0] == '.':
            continue
            
        numbers = int_extractor_string(f.name)
        ep = selectEpisodeBB(numbers)


        eps.append({
            "path":f.path,
            "title":f.name,
            "episode": ep,
            "leecher": "unknown",
            "year": 0,
            "season": int_extractor_string(epoch)[0]
        })
    return eps
    
def scan_tv_show(dir,tvname):
    movies = []
    
    for f in os.scandir(dir):
        if f.is_dir():
            for movie in scan_season(f.path,f.name):
                movie["epoch"] = tvname
                movies.append(movie)
            
        #recursive call made to pick up each episode
        
    return movies

def scan_movies(dir,ext):
    movies = []
    filename = ""
    fullpath = ""
    
    
    for f in os.scandir(dir):
        moviejson = {
            "epoch": "unknown yet",
            "season": 0,
            "episode": 1
        }
        if f.name[0] == '.':
            continue
            
        if f.is_dir():
            count = 1
            for epoch in os.scandir(f):
                if epoch.is_file():
                    curr_ext = os.path.splitext(epoch.name)[1].lower()
                    if curr_ext not in filetypes:
                        continue
                    if epoch.name[0] == '.':
                        continue
                    title,year,author = moviefname_transform(epoch.name)
                    sagajson = {
                        "title": title,
                        "epoch": f.name,
                        "season": 0,
                        "episode": count,
                        "year": year,
                        "leecher": author,
                        "path": epoch.path
                    }
                    movies.append(sagajson)
                    count = count + 1
            continue
            
            #here we will do a for each on the entries that exist within this epoch epoch
        if f.is_file():
            
            curr_ext = os.path.splitext(f.name)[1].lower()
            try:
                okaywhat[curr_ext] = okaywhat[curr_ext] + 1
            except:
                okaywhat[curr_ext] = 1
            
            if curr_ext not in filetypes:
                continue
            moviejson["path"] = f.path
            title,year,author = moviefname_transform(f.name)
            moviejson["title"] = title
            moviejson["year"] = year
            moviejson["leecher"] = author
            movies.append(moviejson)
            
    return movies


objectarray = scan_movies("../redesign-files/movies", filetypes)

print("epoch,episode,year,leecher,title,path")
for movie in objectarray:
    print("{},{},{},{},{},{}".format(movie["epoch"],movie["episode"],movie["year"],movie["leecher"],movie["title"],movie["path"]))
    
objectarray = scan_tv_show("../redesign-files/tv/{}".format(foldername), tvname)
print(okaywhat)
#print("epoch,year,season,episode,leecher,title,path")
#for episode in objectarray:
#    print("{},{},{},{},{},{},{}".format(episode["epoch"],episode["year"],episode["season"],episode["episode"],episode["leecher"],episode["title"],episode["path"]))
# first we load the directory,
# then we stat the directory?
# we have to link children files to a folder if its episode/season
# the idea will to be manually exectue each season for a tv show

#and to also manually enter individual movie titles, or maybe it will be instead to
#organize files into groups again, and to write down folders idk. redesign the file system for sure.again

