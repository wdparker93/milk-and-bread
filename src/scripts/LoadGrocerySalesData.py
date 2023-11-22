import openpyxl
import os
import mysql.connector

curDir = os.getcwd()
print(str (curDir))
#path = 'C:\\Users\\wdpar\\vs_code_repos\\congressional-vote-tracker\\src\\support_files\\output_data_files\\Politician_Raw_Name_Recoder.xlsx'

#recoderWB = openpyxl.load_workbook(path)
#recoderSheet = recoderWB.active

#entryCol = 1
#entryRow = 2

#delimitedList = ""

#entryCell = recoderSheet.cell(row = entryRow, column = entryCol)
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