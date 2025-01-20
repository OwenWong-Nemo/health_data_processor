"""
After processing and analysing data, generate a coffee recommendation that was
intended to be tailored to client's physical and mental needs
"""

"""
Import dependencies
"""
import xml.etree.ElementTree as ET
from config import config
from init import filterData # Optional
from datetime import datetime
from helper_fn import parseTimeSensitiveData, parseDiscreteData, evaluateAppleExerciseTime, evaluateBodyMass, evaluateRestingHeartRate, evaluateSleepAnalysis, evaluateStepCount, getMoodDesc, getWeatherData, getWeatherDataSummary, getCoffeeType, setTemperature, setSweetness, setCaffeine

"""
Constants/ hardcode variable
"""
curr_loc = "Kowloon City"


"""
Load config, to make modification please go to config (config.py) file
"""
raw_xml = config["raw_xml"]
processed_xml = config["processed_xml"]
options = config["options"]
isDiscreteType = config["isDiscreteType"]
isTimeSensitive = config["isTimeSensitive"]
mood_to_coffee_map = config["mood_to_coffeeType"]

"""
Initialising data, comment it out if original file "export.xml" has not been modified
"""
# filterData(raw_xml, processed_xml, options)

"""
Processed data, returning a summary of each health data which will be used for further 
analysis 
"""
# Specify source file path
xml_path = processed_xml
tree = ET.parse(xml_path)
root = tree.getroot()

# Return a summary of a specified HK data type
def getSummary(type: str, records: list):
    # Removing prefix
    if "HKQuantityTypeIdentifier" in type:
        type = type.removeprefix("HKQuantityTypeIdentifier")
    elif "HKCategoryTypeIdentifier" in type:
        type = type.removeprefix("HKCategoryTypeIdentifier")
    else:
        print("Other prefix")
    
    if len(records) < 0:
        print("0 record found.")
    else: 
        values = [float(record['value']) for record in records]
        avr = sum(values) / len(values)
        diff = values[-1] - avr

        latest_rec = {
            'creationDate': records[-1].get('creationDate'), # Optional
            'value': records[-1].get('value'),
            'unit': records[-1].get('unit')
        }

        metric = {
            'type': type,
            'latest_rec': latest_rec,
            'avr':  avr, 
            'diff': diff,
            'diff%': diff/avr * 100
        }
    return metric

# Return list of summary of all wanted data
def getMetrics():
    # Temp storage
    metrics = []
    for type in options:
        records = []
        query = ".//Record[@type='" + type  + "']"

        for record in root.findall(query):
            records.append({
                # More options available: 
                'creationDate': record.get('creationDate'),
                'startDate': record.get('startDate'),
                'endDate': record.get('endDate'),
                'type': record.get('type'),
                'value': record.get('value'),
                'unit': record.get('unit')
            })

        if type in isTimeSensitive:
            data = parseTimeSensitiveData(type, records)
            metric = getSummary(data.get("type"), data.get("records"))
        elif type in isDiscreteType:
            data = parseDiscreteData(type, records)
            metric = getSummary(data.get("type"), data.get("records"))
        else:
            metric = getSummary(type, records)


        metrics.append(metric)
    return metrics

def generateRecommendation():
    # Preparation
    metrics = getMetrics()
    mood_desc = getMoodDesc(estimateMood(metrics))
    coffeeType =  getCoffeeType(mood_desc)
    weather_data_summary = getWeatherDataSummary(getWeatherData(curr_loc))
    curr_time = datetime.now().time()
    
    # For debug
    # for metric in metrics:
    #     print(metric)

    # Init, accessing metric data
    for metric in metrics:
        if metric['type'] == 'AppleExerciseTime':
            exerciseData = metric
        elif metric['type'] == 'BodyMass':
            bodyMassData = metric
        elif metric['type'] == 'RestingHeartRate':
            restingHeartRateData = metric
        elif metric['type'] == 'SleepAnalysis':
            sleepData = metric
        elif metric['type'] == 'StepCount':
            stepCountData = metric

    """
    Customising different properties
    """
    # Customise temperature
    temperature = setTemperature(weather_data_summary) 
    # Customise sweetness level
    sweetness = setSweetness(mood_desc, bodyMassData, sleepData, stepCountData) 
    # Customise caffeine level
    caffeine = setCaffeine(curr_time, sleepData)

    coffee = {
        "coffeeType": coffeeType,
        "temperature": temperature,
        "sweetness": sweetness,
        "caffeine": caffeine
    }

    return coffee

"""
Analyse metrics, evaluate mood then make a recommendation that takes several 
factors into consideration, catering to user's need
"""
def estimateMood(data):
    est_mood = 0
    for metric in data:
        if metric["type"] == "AppleExerciseTime":
            metric_score = evaluateAppleExerciseTime(metric)
            est_mood += metric_score
        elif metric["type"] == "BodyMass":
            metric_score = evaluateBodyMass(metric)
            est_mood += metric_score
        elif metric["type"] == "RestingHeartRate":
            metric_score = evaluateRestingHeartRate(metric)
            est_mood += metric_score
        elif metric["type"] == "SleepAnalysis":
            metric_score = evaluateSleepAnalysis(metric)
            est_mood += metric_score
        elif metric["type"] == "StepCount":
            metric_score = evaluateStepCount(metric)
            est_mood += metric_score
    return est_mood

"""
Test functionality
"""


print(generateRecommendation())
