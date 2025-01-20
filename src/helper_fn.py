"""
Contain parser, helper, special handler function etc
"""
from datetime import datetime, timedelta

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
        

    
    
    



        



