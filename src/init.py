"""
Not all data type (Apple Health Kit) are taken into consideration thus
this file will filter out unwanted data, and stored data we are interested
in analysing
"""
import xml.etree.ElementTree as ET

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

    print(f"\nProcessed data has been initialized and written to: {output_xml_path}\n")