"""
Contain alk parser, helper function etc
"""
from datetime import datetime, timedelta

# Convert time data expressed as string into dateTime obj, easier to perform arithmetic operations
def strToDateTime(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S %z")

# Some AppleHK data are discrete, more detail: README, hence required handler in order to generate data summary 
def parseDiscreteData(type, records: list):
    if not records:
        print("0 records found")
        return []

    rec = []
    totalTime = timedelta(0)  # Initialize as timedelta
    date = records[0].get('creationDate')[:10]  # Get only the date part

    for record in records:
        startDate = strToDateTime(record.get('startDate'))
        endDate = strToDateTime(record.get('endDate'))
        current_date = record.get('creationDate')[:10]  # Get only the date part

        if current_date == date:
            totalTime += endDate - startDate
        else:
            rec.append({
                "creationDate": date,
                "value": totalTime.total_seconds() / 3600,
                "unit": "hours"
            })

            date = current_date
            totalTime = endDate - startDate  

    # Append the last day's data
    rec.append({
        "creationDate": date,
        "value": totalTime.total_seconds() / 3600,
        "unit": "hours"
    })
    return { "type": type, "records": rec}