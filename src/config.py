"""
All options, file path to both "source file" and output file are specified here
"""
config = {
    "raw_xml": "/Users/owenwong/Desktop/health_data_processor/healthData/raw_data/export_demo8.xml", # Input: Raw data
    "processed_xml": "/Users/owenwong/Desktop/health_data_processor/healthData/filtered_data/filtered_demo8.xml", # Output: Filtered data 
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
    },
    "symptoms_to_additives": {
        "fatigue": ["Vitamins B (B12, B6)", "Iron", "Magnesium"],
        "stressAndAnxiety": ["Magnesium", "L-Theanine", "Omega-3 Fatty Acids"],
        "digestiveIssues": ["Probiotics", "Fiber", "Ginger Extract"],
        "poorImmuneFunction": ["Vitamin C", "Zinc", "Echinacea"],
        "jointPain": ["Turmeric (Curcumin)", "Glucosamine"],
        "poorSkinHealth": ["Collagen", "Vitamin E", "Biotin"]
    }
}






