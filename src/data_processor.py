import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

# Importing functionality from other files
from config import config
from init import filterData # Optional
from helper_fn import parseDiscreteData

# Load config, to make modification please go to config (config.py) file
raw_xml = config["raw_xml"]
processed_xml = config["processed_xml"]
options = config["options"]
isDiscreteType = config["isDiscreteType"]

# (Optional) Comment it out if original file "export.xml" has not been modified
# filterData(raw_xml, processed_xml, options)

# Processing filtered/specified data
xml_path = processed_xml
tree = ET.parse(xml_path)
root = tree.getroot()

metrics = []

def formMetric(type: str, records: list):
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
            # 'creationDate': records[-1].get('creationDate'), # Optional
            'value': records[-1].get('value'),
            'unit': records[-1].get('unit')
        }

        metric = {
            'type': type,
            'latest_rec': latest_rec,
            'avr':  avr, 
            'diff': diff,
            'diff %': diff/avr * 100
        }
    return metric
                
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

    if type not in isDiscreteType:
        metric = formMetric(type, records)
    elif type in isDiscreteType:
        data = parseDiscreteData(type, records)
        # print(data.get("type")) 
        metric = formMetric(data.get("type"), data.get("records"))
    else:
        print("Invalid data.")

    metrics.append(metric)

# Test functionality
for metric in metrics:
    print(metric)

# Analyse data

# Ideally the metrics will be passed to a tuned LLM
def get_mood_score_change(diff_percent):
    if diff_percent > 30:
        return 2
    elif diff_percent > 15:
        return 1
    elif diff_percent > -15:
        return 0
    elif diff_percent > -30:
        return -1
    else:
        return -2

def determine_mood_and_coffee(data):
    mood_score = 0

    # Correctly access each metric's 'diff %'
    for metric in data:
        if 'diff %' in metric:
            mood_score += get_mood_score_change(metric['diff %'])

    # Determine mood from the mood score
    mood = 'Positive' if mood_score > 1 else 'Neutral' if mood_score > -1 else 'Negative'

    # Simple logic to choose coffee type based on mood, could be expanded
    coffee_type = 'Latte' if mood == 'Positive' else 'Cappuccino' if mood == 'Neutral' else 'Mocha'
    caffeine_level = 'High' if mood == 'Positive' else 'Medium' if mood == 'Neutral' else 'Low'
    sugar_level = 'Low' if mood == 'Positive' else 'Medium' if mood == 'Neutral' else 'High'

    return {
        'Coffee Type': coffee_type,
        'Caffeine Level': caffeine_level,
        'Sugar Level': sugar_level,
        'Additive': "protein, iron, omega-3"
    }

# Correct the data format and function call if needed
# result = determine_mood_and_coffee(data)
# print("Coffee Recommendation:", result)