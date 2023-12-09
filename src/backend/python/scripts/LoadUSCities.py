from requests_html import HTMLSession
from mysql.connector import Error
import mysql.connector

# Initialize lists to store city names
cities = []
# Initialize lists to store state names
states = []

# Gets the list of the top n cities by population in the continental United States
def fetchUSCitiesFromWeb():
    #Wikipedia URL with list of US cities
    url = "https://en.wikipedia.org/wiki/List_of_United_States_cities_by_population"

    session = HTMLSession()
    response = session.get(url)

    if response.status_code == 200:
        # Render JavaScript and wait for the page to fully load
        response.html.render(sleep=1)

        # Find the table containing the city data
        table = response.html.find('.wikitable.sortable', first=True)

        if table:
            # Iterate over rows in the table
            for row in table.find('tr')[1:201]:  # Skip the header row and get the first 100 rows
                # Extract the city name from the first column
                city_name = row.find('td')[0].text.strip()
                # Extract the state name from the second column
                state_name = row.find('td')[1].text.strip()
                if (state_name != 'Hawaii' and state_name != 'Alaska'):
                    cities.append(city_name)
                    states.append(state_name)
        
            for i in range(len(cities)):
                city = cities[i]
                if '[' in city:
                    indexOfBracket = city.find('[')
                    cities[i] = city[0:indexOfBracket]

# Generates an array of SQL insert statements for insertion of records into the database
def generateInsertArray():
    returnStatementArray = []
    for i in range(len(cities)):
        sqlInsertStatement = "INSERT INTO default_cities(city, state, city_state_key) VALUES ("
        sqlInsertStatement += "'" + cities[i] + "', "   #city
        sqlInsertStatement += "'" + states[i] + "', "     #state
        sqlInsertStatement += "'" + cities[i] + ", " + states[i] + "'"     #city_state_key
        sqlInsertStatement += ");"
        returnStatementArray.append(sqlInsertStatement)
    return returnStatementArray

#Executes array of insertion queries on the database
def insertToDatabase(insertQueryArr):
    dbConnection = mysql.connector.connect(user="root", password="password", host="localhost", database="milk_and_bread_schema")
    if dbConnection.is_connected():
        print('Connection to MySQL DB Successful')
    else:
        print('ERROR: Did not connect to MySQL DB')
        exit()
    crsr = dbConnection.cursor()
    for i in range(len(insertQueryArr)):
        try:
            crsr.execute(insertQueryArr[i])
            dbConnection.commit()
        except Error as e:
            if e.errno == 1062:
                print(f"Error Code 1062 (IntegrityError) occurred for index {i}: {e}. Continuing to next city.")
                continue
            else:
                print(f"An error occurred for index {i}: {e}")
            raise

    dbConnection.close()

fetchUSCitiesFromWeb()
sqlInsertStatementArray = generateInsertArray()
insertToDatabase(sqlInsertStatementArray)