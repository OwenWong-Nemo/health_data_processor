"""
Contain parser, helper, special handler function etc
"""
from datetime import datetime, timedelta
import requests
from config import config

"""
Constants
"""
curr_loc = "Kowloon City" # Ideally should be dynamic
mood_to_coffee_map = config["mood_to_coffeeType"]

"""
Convert time data expressed as string into dateTime obj, easier to perform arithmetic operations
"""
def strToDateTime(date_str: str):
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S %z")

"""
Some AppleHK data are extracted based on time, more detail: README, hence required handler in order to generate data summary 
"""
def parseTimeSensitiveData(type: str, records: list):
    rec = []
    total_time = timedelta(0)  # Initialize as timedelta
    date = records[0].get('creationDate')[:10]  # Get only the date part

    for record in records:
        startDate = strToDateTime(record.get('startDate'))
        endDate = strToDateTime(record.get('endDate'))
        current_date = record.get('creationDate')[:10]  # Get only the date part

        if current_date == date:
            total_time += endDate - startDate
        else:
            rec.append({
                "creationDate": date,
                "value": total_time.total_seconds() / 3600,
                "unit": "hours" # Std unit for time related metrics
            })

            date = current_date
            # Reset and start accumulating
            total_time = endDate - startDate  

    # Append the last day's data
    rec.append({
        "creationDate": date,
        "value": total_time.total_seconds() / 3600,
        "unit": "hours"
    })
    return { "type": type, "records": rec}

"""
Handling discrete data, more detail: README
"""
def parseDiscreteData(type: str, records: list):
    rec = []
    total_val = 0
    date = records[0].get('creationDate')[:10]  

    for record in records:
        current_date = record.get('creationDate')[:10]
        if current_date == date:
            total_val += float(record['value'])
        else:
            rec.append({
                "creationDate": date,
                "value": total_val,
                "unit": record.get('unit')
            })

            date = current_date
            total_val = float(record['value'])

    # Append the last day's data
    rec.append({
        "creationDate": date,
        "value": total_val,
        "unit": record.get('unit')
    })
    return { "type": type, "records": rec}

"""
Handler for each metric, analyse the metric data then return a "score" used
for evaluating mood. Point system/ more detail in README
"""

"""
Check for total exercising time
"""
def evaluateAppleExerciseTime(appleExerciseTimeData: dict): 
    try:
        latest_rec_val = float(appleExerciseTimeData["latest_rec"]["value"]) * 60  # Convert to minutes
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Invalid data encountered in AppleExerciseTime: {e}")
    if latest_rec_val > 45:
        return 1
    elif 25 <= latest_rec_val <= 45:
        return 0
    else:
        return -1
    
"""
Check for rapid weight fluctuation
"""
def evaluateBodyMass(bodyMassData: dict):
    try:
        diff_percentage = bodyMassData["diff%"]
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Invalid data encountered in bodyMass: {e}")           
    if abs(diff_percentage) < 3:
        return 0
    else:
        return -1

"""
Check resting heart rate as well as any irregular fluctuation
"""
def evaluateRestingHeartRate(restingHeartRate: dict):
    try:
        latest_rec_val = int(restingHeartRate["latest_rec"]["value"])
        diff = restingHeartRate["diff"]
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Invalid data encountered in restingHeartRate: {e}")        

    heart_rate = 0
    if 60 <= latest_rec_val <= 100:
        heart_rate += 0
    else:
        heart_rate += -1
    
    fluctuation = 0 
    if diff > 0:
        fluctuation += -1
    elif diff == 0:
        fluctuation += 0
    else:
        fluctuation += 1
    
    return heart_rate + fluctuation

"""
Check if client had enough sleep last night and any irregular changes
"""
def evaluateSleepAnalysis(sleepAnalysisData: dict):
    try:
        latest_rec_val = int(sleepAnalysisData["latest_rec"]["value"])
        diff_percentage = sleepAnalysisData["diff%"]
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Invalid data encountered in sleepAnalysis: {e}")        
    
    sleep = 0
    if 7.5 <= latest_rec_val <= 9:
        sleep += 1
    elif 6.75 < latest_rec_val < 7.5:
        sleep += 0
    else:
        sleep += -1

    fluctuation = 0 
    if abs(diff_percentage) < 30:
        fluctuation += 0
    else:
        fluctuation += -1 
    
    return sleep + fluctuation

"""
Check for step count and any irregular changes
"""
def evaluateStepCount(stepCountData: dict):
    try:
        latest_rec_val = int(stepCountData["latest_rec"]["value"])
        diff_percentage = stepCountData["diff%"]
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Invalid data encountered in stepCount: {e}")        
    
    step_count = 0
    if latest_rec_val > 10000:
        step_count += 1
    else:
        step_count += -1
    
    fluctuation = 0
    if diff_percentage > 15:
        fluctuation += 1
    elif -15 <= diff_percentage <= 15:
        fluctuation += 0
    else:
        fluctuation += -1
    
    return step_count + fluctuation

"""
Functions related to generate coffee recommendation
"""

"""
Return a brief description of the mood, based on the score and the point system
"""
def getMoodDesc(score):
    desc = ""
    if score > 3:
        desc = "Positive"
    elif 1 <= score <= 3:
        desc = "Toward Positive"
    elif -1 <= score <= 0:
        desc = "Neutral" 
    elif -3 <= score <= -2:
        desc = "Toward Negative"
    elif score < -3:
        desc = "Negative"
    return desc

"""
Get current, local weather data
"""
def fetchWeatherData(district):
    api_url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"
    curr_loc_weather = {}
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raises HTTPError for bad responses
        curr_weather = response.json()

        # Get data
        rainfall = next((record for record in curr_weather['rainfall']['data'] if record['place'] == district), None)
        uv = curr_weather['uvindex']['data']
        temperature = next((record for record in curr_weather['temperature']['data'] if record['place'] == district), None)

    except requests.RequestException as error:
        print(f"Failed to fetch weather: {error}")
        return None

    curr_loc_weather = {
        "rainfall": rainfall,
        "uv": uv,
        "temperature": temperature
    }
    return curr_loc_weather

"""
Return a concise summary of the weather data, for customising the coffee
"""
def getWeatherDataSummary(weather_data):
    isRaining = weather_data['rainfall']['max'] < 0
    uv = weather_data['uv'][0]['value'] # For some reason uv data is stored as a list
    temperature = weather_data['temperature']['value']

    summary = {
        "isRaining": isRaining,
        "uv": uv,
        "temperature": temperature
    }
    return summary

"""
Determining the most suitable temperature for the coffee, according to weather data
"""
def setTemperature():
    # Get weather data
    weather_data_summary = getWeatherDataSummary(fetchWeatherData(curr_loc))
    isRaining = weather_data_summary['isRaining']
    temp = weather_data_summary['temperature']
    if temp >= 30:
        temp_desc = "Hot"
    elif 20 <= temp <= 30:
        temp_desc = "Normal"
    else:
        temp_desc = "Cold"
    
    if temp_desc == "Hot":
        coffee_temperature = "Cold"
    elif temp_desc == "Normal":
        coffee_temperature = "Room temperature"
    elif temp_desc == "Cold" or isRaining:
        coffee_temperature = "Hot"
    
    return coffee_temperature
    

def getCoffeeType(mood_desc):
    return mood_to_coffee_map.get(mood_desc)
         




        



