import statistics
import xml.etree.ElementTree as ET

PATH_TO_YOUR_FILE = "/Users/owenwong/Desktop/health_data_processor/health_data_sample/export.xml"

xml_path = PATH_TO_YOUR_FILE
tree = ET.parse(xml_path)
root = tree.getroot()

types = [
    "HKQuantityTypeIdentifierBodyMass",
    # "HKCategoryTypeIdentifierSleepAnalysis", # Unable to retrieve
    "HKQuantityTypeIdentifierAppleExerciseTime",
    "HKQuantityTypeIdentifierHeartRate",
    "HKQuantityTypeIdentifierStepCount",
    "HKQuantityTypeIdentifierRestingHeartRate"
]

data = []
metrics = []

def formMetric(type: str, records: list):
    type = type.removeprefix("HKQuantityTypeIdentifier")
    
    if len(records) < 10:
        metric = {
            'sufficient_dataSet': 0,
            'type': type,
            'latest_rec': 'N.A',
            'avr':  'N.A', 
            'stdev': 'N.A',
            'diff': 'N.A'
        }
    else: 
        dataSet = records[-10:]
        # 'records': list of dict, extract values
        values = [float(record['value']) for record in records]
        avr = sum(values) / len(values)

        metric = {
            'sufficient_dataSet': 1,
            'type': type,
            'latest_rec': records[-1],
            'avr':  avr, 
            'stdev': statistics.stdev(values),
            'diff': values[-1] - avr # latest record - averages
        }
    return metric
    
for type in types:
    records = []
    query = ".//Record[@type='" + type  + "']"

    # For testing
    # sampleQry = ".//Record[@type='HKCategoryTypeIdentifierSleepAnalysis']"
    # for record in root.findall(sampleQry):

    for record in root.findall(query): # Comment this out when testing
        # Mainly for debug
        records.append({
            # More options available: 
            'creationDate': record.get('creationDate'),
            'startDate': record.get('startDate'),
            'endDate': record.get('endDate'),
            'type': record.get('type'),
            'value': record.get('value'),
            'unit': record.get('unit')
        })
    metric = formMetric(type, records)
    metrics.append(metric)

# Hard code data
hardCodeData = {
    # In hours
    'sufficient_dataSet': 1,
    'type': "SleepDuration",
    'latest_rec': 5,
    'avr':  7.5, 
    'stdev': 0,
    'diff': 2.5 
}

for metric in metrics:
    print(metric)