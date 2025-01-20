"""
All options, file path to both "source file" and output file are specified here
"""
config = {
    "raw_xml": "/Users/owenwong/Desktop/health_data_processor/healthDate/export.xml", # Input: Raw data
    "processed_xml": "/Users/owenwong/Desktop/health_data_processor/healthDate/filtered.xml", # Output: Filtered data 
    # More options available, more detail: README
    "options": [
        "HKQuantityTypeIdentifierAppleExerciseTime",
        "HKQuantityTypeIdentifierBodyMass",
        "HKQuantityTypeIdentifierRestingHeartRate",
        "HKCategoryTypeIdentifierSleepAnalysis",
        "HKQuantityTypeIdentifierStepCount"
    ],
    # Please refer to spec (Apple Health Kit) 
    "isTimeSensitive": [
        "HKCategoryTypeIdentifierSleepAnalysis"
    ],
    "isDiscreteType": [ 
        "HKQuantityTypeIdentifierAppleExerciseTime",
        "HKQuantityTypeIdentifierStepCount"
    ],
    "mood_to_coffeeType": {
        "Negative": "Mocha",
        "Toward Negative": "Espresso",
        "Neutral": "Long Black",
        "Toward Positive": "Latte",
        "Positive": "Cappuccino"
    }
}






