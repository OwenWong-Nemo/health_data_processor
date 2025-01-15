import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
# import requests

# Filter non-determinant types data

# File paths
raw_xml = "/Users/owenwong/Desktop/health_data_processor/health_data_sample/export.xml"
processed_xml = "/Users/owenwong/Desktop/health_data_processor/filtered.xml"

options = [
    "HKQuantityTypeIdentifierAppleExerciseTime",
    "HKQuantityTypeIdentifierBodyMass",
    "HKQuantityTypeIdentifierRestingHeartRate",
    "HKCategoryTypeIdentifierSleepAnalysis",
    "HKQuantityTypeIdentifierStepCount"
]

isDiscreteType = [
    "HKCategoryTypeIdentifierSleepAnalysis",
    "HKQuantityTypeIdentifierAppleExerciseTime"
]

def filterData(input_xml_path, output_xml_path, types):
    # Load the original XML data
    tree = ET.parse(input_xml_path)
    root = tree.getroot()

    # Create a new XML element for storing filtered records
    new_root = ET.Element("HealthData")

    # Iterate over the specified types and filter records
    for type in types:
        query = f".//Record[@type='{type}']"
        for record in root.findall(query):
            new_root.append(record)

    # Create a new tree from the filtered root and write to output XML file
    new_tree = ET.ElementTree(new_root)
    new_tree.write(output_xml_path)

    print(f"Processed data has been initialized and written to: {output_xml_path}")

# (Optional) Comment it out if original file "export.xml" has not been modified
# filterData(raw_xml, processed_xml, options)

# Processing filtered/specified data
xml_path = processed_xml
tree = ET.parse(xml_path)
root = tree.getroot()

metrics = []

# Limitation: Unable to parse "HKCategoryTypeIdentifierSleepAnalysis"
def formMetric(type: str, records: list):

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

# Helper function to convert date string to datetime object
def strToDateTime(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S %z")

def parseDiscreteData(type, records: list):
    if not records:
        print("0 records found")
        return []

    sleepRec = []
    totalAsleepTime = timedelta(0)  # Initialize as timedelta
    date = records[0].get('creationDate')[:10]  # Get only the date part

    for record in records:
        startDate = strToDateTime(record.get('startDate'))
        endDate = strToDateTime(record.get('endDate'))
        current_date = record.get('creationDate')[:10]  # Get only the date part

        if current_date == date:
            totalAsleepTime += endDate - startDate
        else:
            sleepRec.append({
                "creationDate": date,
                "value": totalAsleepTime.total_seconds() / 3600,
                "unit": "hours"
            })

            date = current_date
            totalAsleepTime = endDate - startDate  

    # Append the last day's data
    sleepRec.append({
        "creationDate": date,
        "value": totalAsleepTime.total_seconds() / 3600,
        "unit": "hours"
    })
    return { "type": type, "records": sleepRec}
                
for type in options:
    records = []
    query = ".//Record[@type='" + type  + "']"

    # For testing
    # sampleQry = ".//Record[@type='HKCategoryTypeIdentifierSleepAnalysis']"
    # for record in root.findall(sampleQry):

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
result = determine_mood_and_coffee(data)
print("Coffee Recommendation:", result)
