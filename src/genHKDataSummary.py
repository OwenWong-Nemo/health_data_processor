import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

# Importing functionality from other files
from config import config
from init import filterData

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
