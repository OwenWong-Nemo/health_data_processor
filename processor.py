import xml.etree.ElementTree as ET

# Filter non-determinant types data

# File paths
raw_xml = "/Users/owenwong/Desktop/health_data_processor/health_data_sample/export.xml"
processed_xml = "/Users/owenwong/Desktop/health_data_processor/filtered.xml"

options = [
    "HKQuantityTypeIdentifierBodyMass",
    "HKCategoryTypeIdentifierSleepAnalysis",
    "HKQuantityTypeIdentifierAppleExerciseTime",
    "HKQuantityTypeIdentifierHeartRate",
    "HKQuantityTypeIdentifierStepCount",
    "HKQuantityTypeIdentifierRestingHeartRate"
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
    type = type.removeprefix("HKQuantityTypeIdentifier")
    
    if len(records) < 0:
        print("0 record found.")
    else: 
        dataSet = records
        # 'records': list of dict, extract values
        values = [float(record['value']) for record in records]
        avr = sum(values) / len(values)

        latest_rec = {
            'creationDate': records[-1].get('creationDate'),
            'value': records[-1].get('value'),
            'unit': records[-1].get('unit')
        }

        metric = {
            'type': type,
            'latest_rec': latest_rec,
            'avr':  avr, 
            'diff': values[-1] - avr
        }
    return metric

def parseDiscreteData(type: str, records: list):
    type = type.removeprefix("HKQuantityTypeIdentifier")





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
        # TODO
        print("TODO")
    else:
        metric = "N.A. Please check data source file."

    metrics.append(metric)
 
for metric in metrics:
    print(metric)


