import openpyxl
import os
import mysql.connector

curDir = os.getcwd()
print(str (curDir))
print(curDir)
dataDir = curDir + '\\raw_data\\StateAndCategory.xlsx'
print(dataDir)

groceryDataWB = openpyxl.load_workbook(dataDir)
groceryDataSheet = groceryDataWB.active

#Column defintions
dateCol = 1
stateCol = 2

entryRow = 3

#delimitedList = ""

entryCell = groceryDataSheet.cell(row = entryRow, column = stateCol)
print(entryCell.value)
#while entryCell.value != X:
#    if entryCell.value != "" and entryCell.value != None:
#        delimitedList += "'" + entryCell.value + "', "
#    entryRow += 1
#    entryCell = recoderSheet.cell(row = entryRow, column = entryCol)

#delimitedList = delimitedList[:-2]
#outputCell = recoderSheet.cell(row = 2, column = 6)
#outputCell.value = delimitedList

#Executes array of insertion queries on the database
#def insertToDatabase(insertQueryArr):
#    dbConnection = mysql.connector.connect(user="root", password="password", host="localhost", database="milk_and_bread_schema")
#    if dbConnection.is_connected():
#        print('Connection to MySQL DB Successful')
#    else:
#        print('ERROR: Did not connect to MySQL DB')
#        exit()
#    crsr = dbConnection.cursor()
#    for i in range(len(insertQueryArr)):
#        print(insertQueryArr[i])
#        crsr.execute(insertQueryArr[i])
#        dbConnection.commit()
#    dbConnection.close()